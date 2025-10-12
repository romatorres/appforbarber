import { handleApiError, requireRole } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@/generated/prisma";
import { EmployeeSecurity } from "@/lib/employee-security";

// PATCH para alternar acesso ao sistema (criar/remover usuário)
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
        const { hasAccess } = await req.json();

        // Verificar se o funcionário pertence à empresa do usuário
        const belongsToCompany = await EmployeeSecurity.employeeBelongsToUserCompany(id, user.id);
        if (!belongsToCompany) {
            return NextResponse.json(
                { message: "Funcionário não encontrado" },
                { status: 404 }
            );
        }

        // Buscar funcionário atual
        const employee = await prisma.employee.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!employee) {
            return NextResponse.json(
                { message: "Funcionário não encontrado" },
                { status: 404 }
            );
        }

        let userId = employee.userId;

        if (hasAccess && !employee.userId) {
            // Criar usuário para o funcionário
            const existingUser = await prisma.user.findUnique({
                where: { email: employee.email },
            });

            if (existingUser) {
                return NextResponse.json(
                    { error: "Já existe um usuário com este email" },
                    { status: 400 }
                );
            }

            const newUser = await prisma.user.create({
                data: {
                    name: employee.name,
                    email: employee.email,
                    role: Role.EMPLOYEE,
                    companyId: user.companyId!,
                    emailVerified: false,
                },
            });

            userId = newUser.id;

            // Buscar nome da empresa para o email
            const company = await prisma.company.findUnique({
                where: { id: user.companyId! },
                select: { name: true },
            });

            // Enviar email de acesso concedido
            const { EmailService } = await import("@/services/email-service");
            const emailResult = await EmailService.sendSystemAccessGranted({
                to: employee.email,
                employeeName: employee.name,
                companyName: company?.name || "Sua Empresa",
            });

            if (!emailResult.success) {
                console.error("Erro ao enviar email de acesso concedido:", emailResult.error);
            }
        } else if (!hasAccess && employee.userId) {
            // Remover usuário (soft delete)
            await prisma.user.update({
                where: { id: employee.userId },
                data: {
                    role: Role.USER, // Rebaixar para usuário comum
                    companyId: null, // Remover da empresa
                },
            });

            userId = null;

            // Buscar nome da empresa para o email
            const company = await prisma.company.findUnique({
                where: { id: user.companyId! },
                select: { name: true },
            });

            // Enviar email de acesso removido
            const { EmailService } = await import("@/services/email-service");
            const emailResult = await EmailService.sendSystemAccessRevoked({
                to: employee.email,
                employeeName: employee.name,
                companyName: company?.name || "Sua Empresa",
            });

            if (!emailResult.success) {
                console.error("Erro ao enviar email de acesso removido:", emailResult.error);
            }
        }

        // Atualizar funcionário
        const updatedEmployee = await prisma.employee.update({
            where: { id },
            data: {
                hasSystemAccess: hasAccess,
                userId,
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

        return NextResponse.json(updatedEmployee);
    } catch (error) {
        return handleApiError(error);
    }
}