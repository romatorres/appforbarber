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
        <input
          {...register("name")}
          placeholder="Nome do serviço"
          className="border p-2 rounded w-full"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Descrição */}
      <div>
        <textarea
          {...register("description")}
          placeholder="Descrição do serviço"
          rows={3}
          className="border p-2 rounded w-full"
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
          <label className="block text-sm font-medium mb-1">
            Duração (minutos)
          </label>
          <input
            type="number"
            {...register("duration", { valueAsNumber: true })}
            placeholder="30"
            step="5"
            min="5"
            className="border p-2 rounded w-full"
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">
              {errors.duration.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Preço (R$)</label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="border p-2 rounded w-full"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>
      </div>

      {/* Status Ativo (apenas na edição) */}
      {selectedService && (
        <div className="flex items-center gap-2">
          <input
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
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
        >
          {isSubmitting
            ? "Salvando..."
            : selectedService
            ? "Salvar"
            : "Criar Serviço"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
