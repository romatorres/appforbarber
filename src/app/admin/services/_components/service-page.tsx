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
import ServiceList from "./service-list";
import ServiceForm from "./service-form";
import { useServiceStore } from "@/store/service-store";
import { PageTitleAdmin } from "@/components/ui/page-title-admin";
import { ServiceData } from "@/schemas/service-schema";
import { ProtectedButton } from "@/components/auth/ProtectedButton";
import { PERMISSIONS } from "@/lib/permissions";

interface ServicesClientPageProps {
  initialServices: ServiceData[];
}

export default function ServicesClientPage({
  initialServices,
}: ServicesClientPageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { selectedService, selectService, setServices } = useServiceStore();

  useEffect(() => {
    // Hidrata o store com os dados iniciais do servidor
    setServices(initialServices);
  }, [initialServices, setServices]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setIsDialogOpen(false);
      selectService(null);
    } else {
      setIsDialogOpen(true);
    }
  };

  const isEditing = !!selectedService;
  const dialogOpen = isDialogOpen || isEditing;

  return (
    <div className="container mx-auto sm:p-4 p-1 space-y-6">
      <PageTitleAdmin
        title="Serviços"
        description="Gerencie os serviços da sua empresa"
        dialog={
          <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <ProtectedButton
                permission={PERMISSIONS.SERVICE_CREATE}
                className="flex items-center gap-2 w-full sm:w-auto
                justify-center"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Serviço
              </ProtectedButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Editar Serviço" : "Criar Novo Serviço"}
                </DialogTitle>
              </DialogHeader>
              <ServiceForm
                onSuccess={() => {
                  setIsDialogOpen(false);
                  selectService(null);
                }}
              />
            </DialogContent>
          </Dialog>
        }
      />
      <ServiceList />
    </div>
  );
}
