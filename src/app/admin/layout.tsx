import { AdminLayoutClient } from "./_components/admin-layout-client";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
