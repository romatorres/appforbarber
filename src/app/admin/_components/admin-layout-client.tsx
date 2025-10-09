"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { ReactNode } from "react";
import { Bell } from "lucide-react";

interface AdminLayoutClientProps {
  children: ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  // A sessão já é sincronizada pelo AuthProvider no layout principal

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar />

        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          <header className="py-3.5 border-b border-sidebar-border bg-sidebar backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-10">
            <SidebarTrigger className="text-gray-5 hover:text-gray-1 transition-colors" />
            <div className="flex-1" />
            {/* Notificações */}
            <button className="relative p-2 text-gray-5 hover:text-gray-1 transition-colors rounded-lg hover:bg-sidebar-accent">
              <Bell className="w-5 h-5" />{" "}
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-xs text-white items-center justify-center">
                  3
                </span>
              </span>
            </button>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
