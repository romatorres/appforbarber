import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.companyId) {
    return NextResponse.json(
      { message: "Acesso não autorizado ou empresa não encontrada." },
      { status: 401 }
    );
  }

  const data = await req.json();
  const service = await prisma.service.create({
    data: {
      ...data,
      companyId: session.user.companyId,
    },
  });
  return NextResponse.json(service);
}
