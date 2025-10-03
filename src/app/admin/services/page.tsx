"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import ServiceList from "./_components/service-list";
import ServiceForm from "./_components/service-form";
import { useServiceStore } from "@/store/service-store";
import { PageTitleAdmin } from "@/components/ui/page-title-admin";

export default function Services() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { loadServices, selectedService, selectService } = useServiceStore();

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setIsDialogOpen(false);
      selectService(null);
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
              <Button
                className="flex items-center gap-2 w-full sm:w-auto justify-center"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Serviço
              </Button>
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
