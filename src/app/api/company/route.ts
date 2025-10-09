import {
  handleApiError,
  requireCompanyAccess,
  requireRole,
} from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@/generated/prisma";

export async function GET() {
  try {
    const user = await requireCompanyAccess();

    const company = await prisma.company.findUnique({
      where: { id: user.companyId! },
      include: {
        branches: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { message: "Empresa não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN]);
    const data = await req.json();

    const company = await prisma.company.create({ data });
    return NextResponse.json(company);
  } catch (error) {
    return handleApiError(error);
  }
}
