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

    // Verificar se o serviço pertence à empresa do usuário
    const existingService = await prisma.service.findFirst({
      where: {
        id,
        companyId: user.companyId!,
      },
    });

    if (!existingService) {
      return NextResponse.json(
        { message: "Serviço não encontrado" },
        { status: 404 }
      );
    }

    const updated = await prisma.service.update({
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

    // Verificar se o serviço pertence à empresa do usuário
    const existingService = await prisma.service.findFirst({
      where: {
        id,
        companyId: user.companyId!,
      },
    });

    if (!existingService) {
      return NextResponse.json(
        { message: "Serviço não encontrado" },
        { status: 404 }
      );
    }

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
