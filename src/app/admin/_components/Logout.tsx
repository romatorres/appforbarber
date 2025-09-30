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
    <div className="hover:bg-gray-1/15 p-2 rounded-sm w-full">
      <button
        onClick={handleLogout}
        className="w-full flex items-center  cursor-pointer"
      >
        <LogOut className="w-6 h-6 mr-2 text-red-500" />
        <span className="font-bold text-gray-2">Sair</span>
      </button>
    </div>
  );
}
