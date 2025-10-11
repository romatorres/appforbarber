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
                { error: `Limite de funcionários atingido (${current}/${limit})` },
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
                { error: "Email já está em uso por outro funcionário" },
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
                    { error: "Já existe um usuário com este email" },
                    { status: 400 }
                );
            }

            // Criar usuário com senha temporária
            const tempPassword = validatedData.temporaryPassword || Math.random().toString(36).slice(-8);

            const newUser = await prisma.user.create({
                data: {
                    name: validatedData.name,
                    email: validatedData.email,
                    role: Role.EMPLOYEE,
                    companyId: user.companyId!,
                    emailVerified: false,
                },
            });

            userId = newUser.id;

            // TODO: Enviar email de convite com senha temporária
            console.log(`Convite enviado para ${validatedData.email} com senha: ${tempPassword}`);
        }

        // Criar funcionário
        const employee = await prisma.employee.create({
            data: {
                ...validatedData,
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

        return NextResponse.json(employee);
    } catch (error) {
        return handleApiError(error);
    }
}