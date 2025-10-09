"use client";

import { authClient } from "@/lib/auth-client";
import { useSessionStore } from "@/store/session-store";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const clearSession = useSessionStore((state) => state.clearSession);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Limpar store imediatamente
      clearSession();
      
      // Fazer logout no better-auth
      await authClient.signOut();
      
      // Redirecionar
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, limpar store e redirecionar
      clearSession();
      router.push("/");
    }
  };

  return (
    <div className="p-2 rounded-sm w-full">
      <button
        onClick={handleLogout}
        className="w-full flex items-center cursor-pointer"
      >
        <LogOut className="w-6 h-6 mr-2 text-red-500" />
        <span className="font-bold text-gray-5">Sair</span>
      </button>
    </div>
  );
}
