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

    // SUPER_ADMIN pode editar qualquer empresa, outros só a própria
    if (user.role !== Role.SUPER_ADMIN && user.companyId !== id) {
      return NextResponse.json(
        { message: "Acesso negado à empresa" },
        { status: 403 }
      );
    }

    const updated = await prisma.company.update({
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
    const user = await requireRole([Role.SUPER_ADMIN]);

    // Apenas SUPER_ADMIN pode deletar empresas
    await prisma.company.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
