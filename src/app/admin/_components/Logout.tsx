"use client";

import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

export default function Logout() {
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect("/");
        },
      },
    });
  };
  return (
    <div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center py-1 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
      >
        <LogOut className="w-6 h-6 mr-2" />
        <span>Sair</span>
      </button>
    </div>
  );
}
