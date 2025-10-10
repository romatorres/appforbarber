import {
  handleApiError,
  requireCompanyAccess,
  requireRole,
} from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@/generated/prisma";

// GET para buscar profissionais da empresa logada
export async function GET() {
  try {
    const user = await requireCompanyAccess();

    const employee = await prisma.employee.findMany({
      where: { companyId: user.companyId! },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(employee);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST para criar um profissional na empresa logada
export async function POST(req: Request) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
    const data = await req.json();

    const employee = await prisma.employee.create({
      data: {
        ...data,
        companyId: user.companyId!,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    return handleApiError(error);
  }
}
