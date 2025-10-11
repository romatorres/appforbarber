"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, EllipsisVertical, User, Shield } from "lucide-react";
import { useEmployeeStore } from "@/store/employee-store";
import type { EmployeeWithUser } from "@/schemas/employee-schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { PermissionGuard } from "@/components/auth";
import { PERMISSIONS } from "@/lib/permissions";

// Componente para o esqueleto de um item da lista
function EmployeeItemSkeleton() {
  return (
    <Card className="p-4">
      <CardContent className="p-0">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 sm:gap-6">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EmployeeList() {
  const {
    employees,
    loading,
    selectedEmployee,
    deleteEmployee,
    selectEmployee,
  } = useEmployeeStore();
  const [employeeToDelete, setEmployeeToDelete] =
    useState<EmployeeWithUser | null>(null);

  const handleDelete = async (employee: EmployeeWithUser) => {
    try {
      await deleteEmployee(employee.id);
      setEmployeeToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
    }
  };

  const handleConfirmDelete = (employee: EmployeeWithUser) => {
    setEmployeeToDelete(employee);
  };

  const handleCancelDelete = () => {
    setEmployeeToDelete(null);
  };

  const handleEdit = (employee: EmployeeWithUser) => {
    selectEmployee(employee);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="default">Ativo</Badge>;
      case "INACTIVE":
        return <Badge variant="destructive">Inativo</Badge>;
      case "ON_LEAVE":
        return <Badge variant="secondary">Afastado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Durante o carregamento inicial
  if (loading && employees.length === 0) {
    return (
      <div className="space-y-4">
        <EmployeeItemSkeleton />
        <EmployeeItemSkeleton />
        <EmployeeItemSkeleton />
      </div>
    );
  }

  // Se não houver funcionários cadastrados
  if (employees.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-3">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-3" />
          <p className="text-lg font-medium mb-2">
            Nenhum funcionário cadastrado
          </p>
          <p className="text-sm">
            Comece adicionando o primeiro funcionário da sua empresa.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {employees.map((employee: EmployeeWithUser) => (
          <Card
            key={employee.id}
            className={`p-4 border transition-colors ${
              selectedEmployee?.id === employee.id
                ? "border-blue-500 bg-blue-50"
                : ""
            }`}
          >
            <CardContent className="p-0">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{employee.name}</h3>
                      {employee.hasSystemAccess && (
                        <Shield className="h-4 w-4 text-green-600" />
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-gray-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-gray-3" />
                        <span>{employee.email}</span>
                      </div>
                      {employee.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-gray-3" />
                          <span>{employee.phoneNumber}</span>
                        </div>
                      )}
                    </div>

                    {employee.bio && (
                      <p className="text-sm text-gray-4 mt-2">{employee.bio}</p>
                    )}
                  </div>

                  <PermissionGuard
                    permissions={[
                      PERMISSIONS.EMPLOYEE_DELETE,
                      PERMISSIONS.EMPLOYEE_EDIT,
                    ]}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <EllipsisVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(employee)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleConfirmDelete(employee)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </PermissionGuard>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex md:items-center items-start md:gap-4 gap-2.5 md:flex-row flex-col">
                    <div className="text-sm">
                      <span className="text-gray-3">Comissão:</span>
                      <span className="font-semibold ml-1 text-gray-4">
                        {employee.commissionRate}%
                      </span>
                    </div>
                    {employee.specialties && (
                      <div className="text-sm">
                        <span className="text-gray-3">Especialidades:</span>
                        <span className="font-semibold ml-1 text-gray-4">
                          {employee.specialties}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(employee.status)}
                    {employee.user && (
                      <Badge variant="outline" className="text-xs">
                        Sistema
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={!!employeeToDelete} onOpenChange={handleCancelDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o funcionário{" "}
              <span className="font-bold">{employeeToDelete?.name}?</span> Esta
              ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => employeeToDelete && handleDelete(employeeToDelete)}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
