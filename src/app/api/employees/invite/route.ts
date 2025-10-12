import { handleApiError, requireRole } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@/generated/prisma";
import { InviteEmployeeSchema } from "@/schemas/employee-schema";
import { EmployeeSecurity } from "@/lib/employee-security";

// POST para criar funcionário com convite para acesso ao sistema
export async function POST(req: Request) {
    try {
        const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
        const body = await req.json();

        // Validar dados de entrada
        const validatedData = InviteEmployeeSchema.parse(body);

        // Verificar se pode adicionar mais funcionários
        const { canAdd, current, limit } = await EmployeeSecurity.canAddMoreEmployees(user.companyId!);
        if (!canAdd) {
            return NextResponse.json(
                {
                    error: "Limite de funcionários atingido",
                    message: `Sua empresa já possui ${current} funcionários. O limite do seu plano é ${limit === -1 ? 'ilimitado' : limit} funcionários.`,
                    details: { current, limit }
                },
                { status: 400 }
            );
        }

        // Verificar se email já existe na empresa
        const emailAvailable = await EmployeeSecurity.isEmailAvailableInCompany(
            validatedData.email,
            user.companyId!
        );
        if (!emailAvailable) {
            return NextResponse.json(
                {
                    error: "Email já cadastrado",
                    message: `O email "${validatedData.email}" já está sendo usado por outro funcionário da sua empresa.`,
                    suggestion: "Verifique se o funcionário já foi cadastrado ou use um email diferente."
                },
                { status: 400 }
            );
        }

        let userId = null;

        // Se deve enviar convite, criar usuário
        if (validatedData.sendInvite) {
            // Verificar se já existe usuário com este email
            const existingUser = await prisma.user.findUnique({
                where: { email: validatedData.email },
            });

            if (existingUser) {
                return NextResponse.json(
                    {
                        error: "Usuário já existe no sistema",
                        message: `Já existe um usuário cadastrado com o email "${validatedData.email}".`,
                        suggestion: "Este email já possui acesso ao sistema. Se for o mesmo funcionário, você pode editá-lo na lista. Se for uma pessoa diferente, use outro email."
                    },
                    { status: 400 }
                );
            }

            // Gerar senha temporária
            const { generateTemporaryPassword, EmailService } = await import("@/services/email-service");
            const tempPassword = validatedData.temporaryPassword || generateTemporaryPassword();

            const newUser = await prisma.user.create({
                data: {
                    name: validatedData.name,
                    email: validatedData.email,
                    role: Role.EMPLOYEE,
                    companyId: user.companyId!,
                    emailVerified: false,
                    // TODO: Adicionar hash da senha quando implementar autenticação completa
                },
            });

            userId = newUser.id;

            // Buscar nome da empresa para o email
            const company = await prisma.company.findUnique({
                where: { id: user.companyId! },
                select: { name: true },
            });

            // Enviar email de convite
            const emailResult = await EmailService.sendEmployeeInvite({
                to: validatedData.email,
                employeeName: validatedData.name,
                companyName: company?.name || "Sua Empresa",
                temporaryPassword: tempPassword,
            });

            if (!emailResult.success) {
                console.error("Erro ao enviar email de convite:", emailResult.error);
                // Não falhar a criação do funcionário por causa do email
                // Mas vamos informar o usuário
            }
        }

        // Criar funcionário
        const employee = await prisma.employee.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                phoneNumber: validatedData.phoneNumber,
                bio: validatedData.bio,
                commissionRate: validatedData.commissionRate || 50.0,
                specialties: validatedData.specialties,
                status: validatedData.status || "ACTIVE",
                startDate: validatedData.startDate || new Date(),
                companyId: user.companyId!,
                userId,
                hasSystemAccess: validatedData.sendInvite || false,
            },
            include: {
                user: userId ? {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        emailVerified: true,
                    },
                } : false,
            },
        });

        // Atualizar contador de funcionários
        await EmployeeSecurity.updateEmployeeCount(user.companyId!);

        return NextResponse.json({
            ...employee,
            message: validatedData.sendInvite
                ? "Funcionário criado com sucesso! Um convite foi enviado por email com as credenciais de acesso."
                : "Funcionário criado com sucesso!"
        });
    } catch (error) {
        console.error("Erro na API de convite:", error);
        return handleApiError(error);
    }
}