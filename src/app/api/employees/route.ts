import {
  handleApiError,
  requireCompanyAccess,
  requireRole,
} from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@/generated/prisma";
import { CreateEmployeeSchema } from "@/schemas/employee-schema";
import { EmployeeSecurity } from "@/lib/employee-security";

// GET para buscar funcionários da empresa logada
export async function GET() {
  try {
    const user = await requireCompanyAccess();

    const employees = await prisma.employee.findMany({
      where: { companyId: user.companyId! },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(employees);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST para criar um funcionário na empresa logada
export async function POST(req: Request) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
    const body = await req.json();

    // Validar dados de entrada
    const validatedData = CreateEmployeeSchema.parse(body);

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

    // Criar funcionário
    const employee = await prisma.employee.create({
      data: {
        ...validatedData,
        companyId: user.companyId!,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
          },
        },
      },
    });

    // Atualizar contador de funcionários
    await EmployeeSecurity.updateEmployeeCount(user.companyId!);

    return NextResponse.json(employee);
  } catch (error) {
    return handleApiError(error);
  }
}
