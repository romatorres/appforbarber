"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  DollarSign,
  Settings,
  ChevronsUpDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User as AuthUser } from "better-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Logout from "./Logout";
import Image from "next/image";

const mainItems = [
  { title: "Home", url: "/admin", icon: Home },
  { title: "Agendamentos", url: "/admin/agendamentos", icon: Calendar },
  { title: "Serviços", url: "/admin/servicos", icon: Briefcase },
  { title: "Profissionais", url: "/admin/profissionais", icon: Users },
  { title: "Relatórios", url: "/admin/relatorios", icon: BarChart3 },
  { title: "Fechamento", url: "/admin/fechamento", icon: DollarSign },
];

const configItems = [
  { title: "Configurações", url: "/admin/configuracoes", icon: Settings },
];

interface AppSidebarProps {
  user?: AuthUser;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const { open } = useSidebar();
  const pathname = usePathname();
  const collapsed = !open;

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const base = "transition-all duration-200 hover:bg-sidebar-accent";
    return isActive(path)
      ? `${base} bg-gray-1 text-sidebar-foreground hover:bg-gray-1`
      : `${base} text-sidebar-foreground`;
  };

  return (
    <Sidebar
      className={`transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
      collapsible="icon"
    >
      <SidebarHeader
        className={`border-b border-sidebar-border ${
          collapsed ? "py-5" : "p-2.5"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center shadow-elegant">
          <Image
            src="/img/logo-mini.png"
            alt="Logo miniatura"
            height={43}
            width={60}
            className="object-cover"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className={`${collapsed ? "px-0" : "px-2"} py-4`}>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="mb-1">
                    <Link href={item.url} className={getNavClass(item.url)}>
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="mb-1">
                    <Link href={item.url} className={getNavClass(item.url)}>
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {collapsed ? (
              // Sidebar colapsada: só avatar
              <div className="flex items-center justify-center w-full cursor-pointer">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.image ?? ""} />
                  <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              // Sidebar expandida: avatar + nome/email + ícone
              <div className="flex items-center justify-between w-full cursor-pointer hover:bg-gray-1/80 duration-200 p-2 rounded-md">
                {/* Avatar + informações */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.image ?? ""} />
                    <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user?.name ?? "Usuário"}
                    </p>
                    <p className="text-xs truncate">
                      {user?.email ?? "email@exemplo.com"}
                    </p>
                  </div>
                </div>

                {/* Ícone ao lado */}
                <ChevronsUpDown className="w-4 h-4 shrink-0 opacity-60" />
              </div>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" className="w-52">
            <DropdownMenuItem className="p-0">
              <Logout />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
