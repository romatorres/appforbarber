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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Serviços</h1>
          <p className="text-gray-600 mt-2">
            Gerencie os serviços da sua empresa
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2"
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
      </div>

      <ServiceList />
    </div>
  );
}
