import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Logout from "./_components/Logout";

export default async function DashboardHome() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return (
    <div>
      <h1>Seja bem vindo!</h1>
      <p>{session?.user?.name}</p>
      <Logout />
    </div>
  );
}
