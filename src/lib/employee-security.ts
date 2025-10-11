import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma";

/**
 * Middleware de segurança para operações com funcionários/profissionais
 */
export class EmployeeSecurity {
    /**
     * Verifica se o usuário pode gerenciar funcionários
     */
    static async canManageEmployees(userId: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, companyId: true },
        });

        return user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN;
    }

    /**
     * Verifica se o funcionário pertence à empresa do usuário
     */
    static async employeeBelongsToUserCompany(
        employeeId: string,
        userId: string
    ): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { companyId: true },
        });

        if (!user?.companyId) return false;

        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
            select: { companyId: true },
        });

        return employee?.companyId === user.companyId;
    }

    /**
     * Obtém a empresa do usuário logado
     */
    static async getUserCompany(userId: string): Promise<string | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { companyId: true },
        });

        return user?.companyId || null;
    }

    /**
     * Verifica se o email já está em uso na empresa
     */
    static async isEmailAvailableInCompany(
        email: string,
        companyId: string,
        excludeEmployeeId?: string
    ): Promise<boolean> {
        const existingEmployee = await prisma.employee.findFirst({
            where: {
                email,
                companyId,
                id: excludeEmployeeId ? { not: excludeEmployeeId } : undefined,
            },
        });

        return !existingEmployee;
    }

    /**
     * Verifica limites de funcionários da empresa
     */
    static async canAddMoreEmployees(companyId: string): Promise<{
        canAdd: boolean;
        current: number;
        limit: number;
    }> {
        const company = await prisma.company.findUnique({
            where: { id: companyId },
            select: {
                maxEmployees: true,
                currentEmployees: true
            },
        });

        if (!company) {
            return { canAdd: false, current: 0, limit: 0 };
        }

        const canAdd = company.maxEmployees === -1 ||
            company.currentEmployees < company.maxEmployees;

        return {
            canAdd,
            current: company.currentEmployees,
            limit: company.maxEmployees,
        };
    }

    /**
     * Atualiza contador de funcionários da empresa
     */
    static async updateEmployeeCount(companyId: string): Promise<void> {
        const count = await prisma.employee.count({
            where: {
                companyId,
                status: { not: "INACTIVE" }
            },
        });

        await prisma.company.update({
            where: { id: companyId },
            data: { currentEmployees: count },
        });
    }
}

// Alias para compatibilidade
export const ProfessionalSecurity = EmployeeSecurity;