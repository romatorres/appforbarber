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
import { Clock, DollarSign, EllipsisVertical } from "lucide-react";
import { useServiceStore } from "@/store/service-store";
import type { ServiceData as Service } from "@/schemas/service-schema";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { PermissionGuard } from "@/components/auth";
import { PERMISSIONS } from "@/lib/permissions";

// Componente para o esqueleto de um item da lista
function ServiceItemSkeleton() {
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

export default function ServiceList() {
  const { services, loading, selectedService, deleteService, selectService } =
    useServiceStore();
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const handleDelete = async (service: Service) => {
    try {
      await deleteService(service.id);
      setServiceToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
    }
  };

  const handleConfirmDelete = (service: Service) => {
    setServiceToDelete(service);
  };

  const handleCancelDelete = () => {
    setServiceToDelete(null);
  };

  const handleEdit = (service: Service) => {
    selectService(service);
  };

  // Durante o carregamento inicial (sem serviços na lista ainda)
  if (loading && services.length === 0) {
    return (
      <div className="space-y-4">
        <ServiceItemSkeleton />
        <ServiceItemSkeleton />
        <ServiceItemSkeleton />
      </div>
    );
  }

  // Após o carregamento, se não houver serviços
  if (services.length === 0) {
    return (
      <CardContent className="p-4 text-center text-gray-2">
        Nenhum serviço cadastrado
      </CardContent>
    );
  }

  // Renderiza a lista de serviços
  return (
    <div>
      <div className="space-y-4">
        {services.map((service: Service) => (
          <Card
            key={service.id}
            className={`p-4 border transition-colors ${
              selectedService?.id === service.id
                ? "border-blue-500 bg-blue-50"
                : ""
            }`}
          >
            <CardContent className="p-0">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {service.description}
                    </p>
                  </div>
                  <PermissionGuard
                    permissions={[
                      PERMISSIONS.SERVICE_DELETE,
                      PERMISSIONS.SERVICE_EDIT,
                    ]}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <EllipsisVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(service)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleConfirmDelete(service)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </PermissionGuard>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-600 font-bold">
                        {formatCurrency(service.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-600 font-semibold">
                        {service.duration} min
                      </p>
                    </div>
                  </div>

                  <div>
                    <Badge variant={service.active ? "default" : "destructive"}>
                      {service.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={!!serviceToDelete} onOpenChange={handleCancelDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o serviço{" "}
              <span className="font-bold"> {serviceToDelete?.name}? </span>
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => serviceToDelete && handleDelete(serviceToDelete)}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
