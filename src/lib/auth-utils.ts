import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });

  if (!session?.userId) {
    throw new Error("Não autorizado");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      role: true,
      companyId: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  return user;
}

export async function requireRole(allowedRoles: Role | Role[]) {
  const user = await getAuthenticatedUser();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(user.role)) {
    throw new Error("Permissão insuficiente");
  }

  return user;
}

export async function requireCompanyAccess(companyId?: string) {
  const user = await getAuthenticatedUser();

  if (user.role === Role.SUPER_ADMIN) return user;

  if (!user.companyId || (companyId && user.companyId !== companyId)) {
    throw new Error("Acesso negado à empresa");
  }

  return user;
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof Error) {
    if (error.message === "Não autorizado") {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    if (
      error.message === "Permissão insuficiente" ||
      error.message === "Acesso negado à empresa"
    ) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }
    if (error.message === "Usuário não encontrado") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
  }

  return NextResponse.json(
    { message: "Erro interno do servidor" },
    { status: 500 }
  );
}
