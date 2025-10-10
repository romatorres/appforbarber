import { handleApiError, requireRole } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@/generated/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
    const data = await req.json();

    // Verificar se o profissional pertence à empresa do usuário
    const existingProfessional = await prisma.employee.findFirst({
      where: {
        id,
        companyId: user.companyId!,
      },
    });

    if (!existingProfessional) {
      return NextResponse.json(
        { message: "Profissional não encontrado" },
        { status: 404 }
      );
    }

    const updated = await prisma.employee.update({
      where: { id },
      data,
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

    // Verificar se o profissional pertence à empresa do usuário
    const existingProfessional = await prisma.employee.findFirst({
      where: {
        id,
        companyId: user.companyId!,
      },
    });

    if (!existingProfessional) {
      return NextResponse.json(
        { message: "Profissional não encontrado" },
        { status: 404 }
      );
    }

    await prisma.employee.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
