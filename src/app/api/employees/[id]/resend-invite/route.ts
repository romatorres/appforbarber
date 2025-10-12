import { handleApiError, requireRole } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@/generated/prisma";
import { EmployeeSecurity } from "@/lib/employee-security";

// POST para reenviar convite para funcionário
export async function POST(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

        // Verificar se o funcionário pertence à empresa do usuário
        const belongsToCompany = await EmployeeSecurity.employeeBelongsToUserCompany(id, user.id);
        if (!belongsToCompany) {
            return NextResponse.json(
                { message: "Funcionário não encontrado" },
                { status: 404 }
            );
        }

        // Buscar funcionário
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

        if (!employee.hasSystemAccess || !employee.userId) {
            return NextResponse.json(
                { error: "Funcionário não tem acesso ao sistema" },
                { status: 400 }
            );
        }

        // Buscar nome da empresa para o email
        const company = await prisma.company.findUnique({
            where: { id: user.companyId! },
            select: { name: true },
        });

        // Gerar nova senha temporária
        const { generateTemporaryPassword, EmailService } = await import("@/services/email-service");
        const tempPassword = generateTemporaryPassword();

        // Reenviar email de convite
        const emailResult = await EmailService.resendEmployeeInvite({
            to: employee.email,
            employeeName: employee.name,
            companyName: company?.name || "Sua Empresa",
            temporaryPassword: tempPassword,
        });

        if (!emailResult.success) {
            return NextResponse.json(
                { error: "Erro ao reenviar convite por email" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Convite reenviado com sucesso",
            messageId: emailResult.messageId
        });
    } catch (error) {
        return handleApiError(error);
    }
}