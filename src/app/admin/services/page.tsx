import { prisma } from "@/lib/prisma";
import ServicesClientPage from "./_components/services-page";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { toast } from "sonner";

// Revalidate this page every 60 seconds
export const revalidate = 60;

export default async function ServicesPage() {
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
      "Usuário sem empresa associada tentou acessar a página de serviços."
    );
    return <ServicesClientPage initialServices={[]} />;
  }

  const services = await prisma.service.findMany({
    where: {
      companyId: user.companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <ServicesClientPage initialServices={services} />;
}
