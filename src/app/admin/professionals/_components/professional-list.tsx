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
import { Clock, EllipsisVertical } from "lucide-react";
import { useProfessionalStore } from "@/store/professional-store";
import type { ProfessionalData as Professional } from "@/schemas/professional-schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { PermissionGuard } from "@/components/auth";
import { PERMISSIONS } from "@/lib/permissions";

// Componente para o esqueleto de um item da lista
function ProfessionItemSkeleton() {
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

export default function ProfessionalList() {
  const {
    professionals,
    loading,
    selectedProfessional,
    deleteProfessional,
    selectProfessional,
  } = useProfessionalStore();
  const [professionalToDelete, setProfessionalToDelete] =
    useState<Professional | null>(null);

  const handleDelete = async (professional: Professional) => {
    try {
      await deleteProfessional(professional.id);
    } catch (error) {
      console.error("Erro ao excluir profissional:", error);
    }
  };

  const handleConfirmDelete = (professional: Professional) => {
    setProfessionalToDelete(professional);
  };

  const handleCancelDelete = () => {
    setProfessionalToDelete(null);
  };

  const handleEdit = (professional: Professional) => {
    selectProfessional(professional);
  };

  // Durante o carregamento inicial (sem profissional na lista ainda)
  if (loading && professionals.length === 0) {
    return (
      <div className="space-y-4">
        <ProfessionItemSkeleton />
        <ProfessionItemSkeleton />
        <ProfessionItemSkeleton />
      </div>
    );
  }
  // Se não houver profissionais cadastrados
  if (professionals.length === 0) {
    return (
      <CardContent className="p-4 text-center text-gray-2">
        Nenhum profissional cadastrado ainda.
      </CardContent>
    );
  }
  // Renderiza a lista de serviços
  return (
    <div>
      <div className="space-y-4">
        {professionals.map((professional: Professional) => (
          <Card
            key={professional.id}
            className={`p-4 border transition-colors ${
              selectedProfessional?.id === professional.id
                ? "border-blue-500 bg-blue-50"
                : ""
            }`}
          >
            <CardContent className="p-0">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {professional.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {professional.bio}
                    </p>
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
                        <DropdownMenuItem
                          onClick={() => handleEdit(professional)}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleConfirmDelete(professional)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </PermissionGuard>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-600 font-semibold">
                      {professional.commissionRate} %
                    </p>
                  </div>
                  <div>
                    <Badge
                      variant={professional.status ? "default" : "destructive"}
                    >
                      {professional.status ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={!!professionalToDelete} onOpenChange={handleCancelDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o serviço{" "}
              <span className="font-bold"> {professionalToDelete?.name}? </span>
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                professionalToDelete && handleDelete(professionalToDelete)
              }
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
