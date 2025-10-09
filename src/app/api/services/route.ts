import {
  handleApiError,
  requireCompanyAccess,
  requireRole,
} from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@/generated/prisma";

// GET para buscar serviços da empresa logada
export async function GET() {
  try {
    const user = await requireCompanyAccess();

    const services = await prisma.service.findMany({
      where: { companyId: user.companyId! },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST para criar um serviço na empresa logada
export async function POST(req: Request) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
    const data = await req.json();

    const service = await prisma.service.create({
      data: {
        ...data,
        companyId: user.companyId!,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    return handleApiError(error);
  }
}
