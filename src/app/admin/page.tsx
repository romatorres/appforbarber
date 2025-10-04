import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PageTitleAdmin } from "@/components/ui/page-title-admin";

export default async function DashboardHome() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return (
    <div className="container mx-auto sm:p-4 p-1">
      <PageTitleAdmin
        title="Painel de Controle"
        description="Seja bem vindo ao seu painel!"
      />
    </div>
  );
}
