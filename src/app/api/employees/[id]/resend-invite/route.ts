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

        // TODO: Implementar envio de email
        // Por enquanto, apenas log
        console.log(`Convite reenviado para ${employee.email}`);

        return NextResponse.json({
            success: true,
            message: "Convite reenviado com sucesso"
        });
    } catch (error) {
        return handleApiError(error);
    }
}