import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// GET para buscar serviços da empresa logada
export async function GET() {
  const session = await auth.api.getSession({ headers: new Headers(await headers()) });

  if (!session?.userId) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { companyId: true },
  });

  if (!user?.companyId) {
    return NextResponse.json(
      { message: "Usuário não associado a uma empresa" },
      { status: 400 }
    );
  }

  const services = await prisma.service.findMany({
    where: {
      companyId: user.companyId, // Filtro de segurança
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(services);
}

// POST para criar um serviço na empresa logada
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: new Headers(await headers()) });

  if (!session?.userId) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { companyId: true },
  });

  if (!user?.companyId) {
    return NextResponse.json(
      { message: "Usuário não associado a uma empresa" },
      { status: 400 }
    );
  }

  const data = await req.json();
  const service = await prisma.service.create({
    data: {
      ...data,
      companyId: user.companyId, // Usar o companyId do usuário da sessão
    },
  });
  return NextResponse.json(service);
}