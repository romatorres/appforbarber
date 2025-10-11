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
import ProfessionalList from "./professional-list";
import ProfessionalForm from "./professional-form";
import { useProfessionalStore } from "@/store/professional-store";
import { PageTitleAdmin } from "@/components/ui/page-title-admin";
import { ProfessionalData } from "@/schemas/professional-schema";
import { ProtectedButton } from "@/components/auth/ProtectedButton";
import { PERMISSIONS } from "@/lib/permissions";

interface ProfessionalsClientPageProps {
  initialProfessional?: ProfessionalData[];
}

export default function ProfessionalsClientPage({
  initialProfessional,
}: ProfessionalsClientPageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { selectedProfessional, selectProfessional, setProfessionals } =
    useProfessionalStore();

  useEffect(() => {
    // Hidrata o store com os dados iniciais do servidor
    setProfessionals(initialProfessional);
  }, [initialProfessional, setProfessionals]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setIsDialogOpen(false);
      selectProfessional(null);
    } else {
      setIsDialogOpen(true);
    }
  };

  const isEditing = !!selectedProfessional;
  const dialogOpen = isDialogOpen || isEditing;

  return (
    <div className="container mx-auto sm:p-4 p-1 space-y-6">
      <PageTitleAdmin
        title="Profissionais"
        description="Gerencie os profissionais da sua empresa"
        dialog={
          <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <ProtectedButton
                permission={PERMISSIONS.EMPLOYEE_CREATE}
                className="flex items-center gap-2 w-full sm:w-auto
                justify-center"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Profissionais
              </ProtectedButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditing
                    ? "Editar Profissional"
                    : "Criar Novo Profissional"}
                </DialogTitle>
              </DialogHeader>
              <ProfessionalForm
                onSuccess={() => {
                  setIsDialogOpen(false);
                  selectProfessional(null);
                }}
              />
            </DialogContent>
          </Dialog>
        }
      />
      <ProfessionalList />
    </div>
  );
}
