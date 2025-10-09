"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Role } from "@/generated/prisma";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  Home,
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  DollarSign,
  Settings,
  ChevronsUpDown,
  ChevronDown,
  CircleDollarSign,
  Building2,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  { title: "Serviços", url: "/admin/services", icon: Briefcase },
  { title: "Profissionais", url: "/admin/profissionais", icon: Users },
  { title: "Relatórios", url: "/admin/relatorios", icon: BarChart3 },
  { title: "Fechamento", url: "/admin/fechamento", icon: DollarSign },
];

const configItems = [
  {
    title: "Configurações",
    icon: Settings,
    submenu: [
      { title: "Empresa", url: "/admin/settings/company", icon: Building2 },
      {
        title: "Pagamentos",
        url: "/admin/settings/payments",
        icon: CircleDollarSign,
      },
    ],
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const pathname = usePathname();
  const collapsed = !open;
  const { hasRole, user } = useAuth();

  // Memoizar funções para evitar re-renders
  const isActive = useCallback((path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  }, [pathname]);

  const getNavClass = useCallback((path: string) => {
    const base = "transition-all duration-200 hover:bg-sidebar-accent";
    return isActive(path)
      ? `${base} bg-gray-1 text-sidebar-foreground hover:bg-gray-1`
      : `${base} text-sidebar-foreground`;
  }, [isActive]);

  return (
    <Sidebar
      className={`transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
      collapsible="icon"
    >
      {/* ===== Header ===== */}
      <SidebarHeader
        className={`border-b border-sidebar-border ${
          collapsed ? "py-5" : "p-2.5"
        }`}
      >
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

      {/* ===== Conteúdo ===== */}
      <SidebarContent className={`${collapsed ? "px-0" : "px-2"} py-4`}>
        {/* Grupo principal */}
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

        {/* Grupo Sistema (com submenu colapsável) */}
        {hasRole([Role.SUPER_ADMIN, Role.ADMIN]) && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
              Sistema
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {configItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Collapsible
                      defaultOpen={false}
                      className="group/collapsible"
                    >
                      {/* Botão principal do menu */}
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="mb-1 w-full flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!collapsed && (
                              <span className="font-medium">{item.title}</span>
                            )}
                          </div>

                          {!collapsed && (
                            <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      {/* Submenu (visível só quando aberto) */}
                      <CollapsibleContent>
                        {!collapsed && item.submenu && (
                          <SidebarMenuSub>
                            {item.submenu.map((sub) => (
                              <SidebarMenuSubItem key={sub.title}>
                                <SidebarMenuSubButton asChild>
                                  <Link
                                    href={sub.url}
                                    className={getNavClass(sub.url)}
                                  >
                                    <sub.icon className="w-4 h-4 shrink-0 !text-sidebar-foreground" />
                                    <span>{sub.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* ===== Footer ===== */}
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {collapsed ? (
              <div className="flex items-center justify-center w-full cursor-pointer">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.image ?? ""} />
                  <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full cursor-pointer hover:bg-gray-1/80 duration-200 p-2 rounded-md">
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
