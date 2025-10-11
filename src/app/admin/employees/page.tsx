import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { toast } from "sonner";
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
    toast.error(
      "Usuário sem empresa associada tentou acessar a página de funcionários."
    );
    return <EmployeesClientPage initialEmployees={[]} />;
  }

  const employees = await prisma.employee.findMany({
    where: {
      companyId: user.companyId,
    },
    include: {
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

  return <EmployeesClientPage initialEmployees={employees} />;
}
