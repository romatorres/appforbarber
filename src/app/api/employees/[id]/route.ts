import { handleApiError, requireRole } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@/generated/prisma";
import { UpdateEmployeeSchema } from "@/schemas/employee-schema";
import { EmployeeSecurity } from "@/lib/employee-security";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    // Verificar se o funcionário pertence à empresa do usuário
    const employee = await prisma.employee.findFirst({
      where: {
        id,
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

    if (!employee) {
      return NextResponse.json(
        { message: "Funcionário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
    const body = await req.json();

    // Validar dados de entrada
    const validatedData = UpdateEmployeeSchema.parse(body);

    // Verificar se o funcionário pertence à empresa do usuário
    const belongsToCompany = await EmployeeSecurity.employeeBelongsToUserCompany(id, user.id);
    if (!belongsToCompany) {
      return NextResponse.json(
        { message: "Funcionário não encontrado" },
        { status: 404 }
      );
    }

    // Se está alterando email, verificar se não está em uso
    if (validatedData.email) {
      const emailAvailable = await EmployeeSecurity.isEmailAvailableInCompany(
        validatedData.email,
        user.companyId!,
        id
      );
      if (!emailAvailable) {
        return NextResponse.json(
          { error: "Email já está em uso por outro funcionário" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: validatedData,
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

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
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

    // Soft delete - marcar como inativo em vez de deletar
    await prisma.employee.update({
      where: { id },
      data: { status: "INACTIVE" },
    });

    // Atualizar contador de funcionários
    await EmployeeSecurity.updateEmployeeCount(user.companyId!);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
