"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateServiceSchema,
  CreateServiceData,
  UpdateServiceSchema,
  UpdateServiceData,
} from "@/schemas/service-schema";
import { useServiceStore } from "@/store/service-store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ServiceFormProps {
  onSuccess?: () => void;
}

type ServiceFormData = CreateServiceData | UpdateServiceData;

export default function ServiceForm({ onSuccess }: ServiceFormProps) {
  const { createServices, selectedService, updateServices, selectService } =
    useServiceStore();
  const router = useRouter();

  const isEdit = !!selectedService;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(isEdit ? UpdateServiceSchema : CreateServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: 30,
      price: 0,
      active: true,
    },
  });

  useEffect(() => {
    if (selectedService) {
      reset({
        name: selectedService.name,
        description: selectedService.description,
        duration: selectedService.duration,
        price: selectedService.price,
        active: selectedService.active,
      });
    } else {
      reset({
        name: "",
        description: "",
        duration: 30,
        price: 0,
        active: true,
      });
    }
  }, [selectedService, reset]);

  const onSubmit = async (data: ServiceFormData) => {
    try {
      if (selectedService) {
        await updateServices(selectedService.id, data as UpdateServiceData);
      } else {
        await createServices(data as CreateServiceData);
      }

      reset({
        name: "",
        description: "",
        duration: 30,
        price: 0,
        active: true,
      });
      selectService(null);

      // Chama callback de sucesso ou redireciona
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/services");
      }
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
    }
  };

  const handleCancel = () => {
    selectService(null);
    reset({
      name: "",
      description: "",
      duration: 30,
      price: 0,
      active: true,
    });

    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/services");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nome */}
      <div>
        <label className="block text-sm text-gray-3 mb-1">
          Nome do serviço
        </label>
        <Input {...register("name")} placeholder="Nome do serviço" />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm text-gray-3 mb-1">
          Descrição do serviço
        </label>
        <Textarea
          {...register("description")}
          placeholder="Descrição do serviço"
          rows={3}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Duração e Preço */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-3 mb-1">
            Duração (minutos)
          </label>
          <Input
            type="number"
            {...register("duration", { valueAsNumber: true })}
            placeholder="30"
            step="5"
            min="5"
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">
              {errors.duration.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-3 mb-1">Preço (R$)</label>
          <Input
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>
      </div>

      {/* Status Ativo (apenas na edição) */}
      {selectedService && (
        <div className="flex items-center gap-2">
          <Input
            type="checkbox"
            {...register("active")}
            id="active"
            className="w-4 h-4"
          />
          <label htmlFor="active" className="text-sm font-medium">
            Serviço ativo
          </label>
          {errors.active && (
            <p className="text-red-500 text-sm mt-1">{errors.active.message}</p>
          )}
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" onClick={handleCancel} variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} variant="default">
          {isSubmitting
            ? "Salvando..."
            : selectedService
            ? "Salvar"
            : "Criar Serviço"}
        </Button>
      </div>
    </form>
  );
}
