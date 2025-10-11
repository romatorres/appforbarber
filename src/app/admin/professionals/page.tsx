import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import ProfessionalsClientPage from "./_components/professional-page";

// Revalidate this page every 60 seconds
export const revalidate = 60;

export default async function ProfessionalsPage() {
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
      "Usuário sem empresa associada tentou acessar a página de profissionais."
    );
    return <ProfessionalsClientPage initialProfessional={[]} />;
  }

  const professional = await prisma.employee.findMany({
    where: {
      companyId: user.companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <ProfessionalsClientPage initialProfessional={professional} />;
}
