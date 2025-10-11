"use client";

import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import EmployeeList from "./employee-list";
import EmployeeForm from "./employee-form";
import { useEmployeeStore } from "@/store/employee-store";
import { PageTitleAdmin } from "@/components/ui/page-title-admin";
import { EmployeeWithUser } from "@/schemas/employee-schema";
import { ProtectedButton } from "@/components/auth/ProtectedButton";
import { PERMISSIONS } from "@/lib/permissions";

interface EmployeesClientPageProps {
  initialEmployees?: EmployeeWithUser[];
}

export default function EmployeesClientPage({
  initialEmployees,
}: EmployeesClientPageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { selectedEmployee, selectEmployee, setEmployees } = useEmployeeStore();

  useEffect(() => {
    // Hidrata o store com os dados iniciais do servidor
    if (initialEmployees) {
      setEmployees(initialEmployees);
    }
  }, [initialEmployees, setEmployees]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setIsDialogOpen(false);
      selectEmployee(null);
    } else {
      setIsDialogOpen(true);
    }
  };

  const isEditing = !!selectedEmployee;
  const dialogOpen = isDialogOpen || isEditing;

  return (
    <div className="container mx-auto sm:p-4 p-1 space-y-6">
      <PageTitleAdmin
        title="Funcionários"
        description="Gerencie os funcionários da sua empresa"
        dialog={
          <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <ProtectedButton
                permission={PERMISSIONS.EMPLOYEE_CREATE}
                className="flex items-center gap-2 w-full sm:w-auto justify-center"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Novo Funcionário
              </ProtectedButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditing
                    ? "Editar Funcionário"
                    : "Cadastrar Novo Funcionário"}
                </DialogTitle>
              </DialogHeader>
              <EmployeeForm
                onSuccess={() => {
                  setIsDialogOpen(false);
                  selectEmployee(null);
                }}
              />
            </DialogContent>
          </Dialog>
        }
      />
      <EmployeeList />
    </div>
  );
}
