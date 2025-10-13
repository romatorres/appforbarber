import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import EmployeesClientPage from "./_components/employee-page";

// Revalidate this page every 60 seconds
export const revalidate = 60;

export default async function EmployeesPage() {
  const session = await auth.api.getSession({
    headers: new Headers(await headers()),
  });
  if (!session?.userId) {
    redirect("/api/auth/signin");
  }

  // Usar o userId da sessão para buscar o usuário e seu companyId
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { companyId: true },
  });

  // Se o usuário não tiver uma empresa, retorna uma lista vazia.
  if (!user?.companyId) {
    console.error(
      "Usuário sem empresa associada tentou acessar a página de funcionários."
    );
    return <EmployeesClientPage initialEmployees={[]} />;
  }

  const employeesData = await prisma.employee.findMany({
    where: {
      companyId: user.companyId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      bio: true,
      commissionRate: true,
      specialties: true,
      status: true,
      startDate: true,
      createdAt: true,
      updatedAt: true,
      companyId: true,
      branchId: true,
      userId: true,
      hasSystemAccess: true,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  const employees = employeesData.map((e) => ({
    ...e,
    status: e.status as "ACTIVE" | "INACTIVE" | "ON_LEAVE",
    branchId: e.branchId || undefined, // Converter null para undefined
    userId: e.userId || undefined, // Converter null para undefined
    phoneNumber: e.phoneNumber || undefined, // Converter null para undefined
    specialties: e.specialties || undefined, // Converter null para undefined
    bio: e.bio || undefined, // Converter null para undefined
    user: e.user
      ? {
          ...e.user,
          role: e.user.role as string, // Converter Role enum para string
        }
      : null,
  }));

  return <EmployeesClientPage initialEmployees={employees} />;
}
