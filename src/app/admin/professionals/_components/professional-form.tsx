"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CreateProfessionalSchema,
  CreateProfessionalData,
  UpdateProfessionalSchema,
  UpdateProfessionalData,
} from "@/schemas/professional-schema";
import { useProfessionalStore } from "@/store/professional-store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Create form-specific schemas that exclude fields not needed in the form
const FormProfessionalSchema = CreateProfessionalSchema.omit({
  startDate: true,
});
const FormUpdateProfessionalSchema = UpdateProfessionalSchema.omit({
  startDate: true,
});

type FormProfessionalData = z.infer<typeof FormProfessionalSchema>;
type FormUpdateProfessionalData = z.infer<typeof FormUpdateProfessionalSchema>;
type FormProfessionalFormData =
  | FormProfessionalData
  | FormUpdateProfessionalData;

interface ProfessionalFormProps {
  onSuccess?: () => void;
}

export default function ProfessionalForm({ onSuccess }: ProfessionalFormProps) {
  const {
    createProfessionals,
    selectedProfessional,
    updateProfessionals,
    selectProfessional,
  } = useProfessionalStore();
  const router = useRouter();

  const isEdit = !!selectedProfessional;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormProfessionalFormData>({
    resolver: zodResolver(
      isEdit ? FormUpdateProfessionalSchema : FormProfessionalSchema
    ),
    defaultValues: {
      name: "",
      bio: "",
      commissionRate: 0,
      email: "",
      phoneNumber: "",
      specialties: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (selectedProfessional) {
      reset({
        name: selectedProfessional.name,
        bio: selectedProfessional.bio,
        commissionRate: selectedProfessional.commissionRate,
        email: selectedProfessional.email,
        phoneNumber: selectedProfessional.phoneNumber,
        specialties: selectedProfessional.specialties,
        status: selectedProfessional.status,
      });
    } else {
      reset({
        name: "",
        bio: "",
        commissionRate: 0,
        email: "",
        phoneNumber: "",
        specialties: "",
        status: "ACTIVE",
      });
    }
  }, [selectedProfessional, reset]);

  const onSubmit = async (data: FormProfessionalFormData) => {
    try {
      if (selectedProfessional) {
        // For update, only send the fields that are present in the form data
        await updateProfessionals(
          selectedProfessional.id,
          data as UpdateProfessionalData
        );
      } else {
        // For create, we don't include fields not in the form as they will be set on the server
        const createData: CreateProfessionalData = {
          ...(data as FormProfessionalData),
          startDate: new Date(), // Set the start date automatically
        };
        await createProfessionals(createData);
      }

      reset({
        name: "",
        bio: "",
        commissionRate: 0,
        email: "",
        phoneNumber: "",
        specialties: "",
        status: "ACTIVE",
      });
      selectProfessional(null);

      // Chama callback de sucesso ou redireciona
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/professionals");
      }
    } catch (error) {
      console.error("Erro ao salvar profissional:", error);
    }
  };

  const handleCancel = () => {
    selectProfessional(null);
    reset({
      name: "",
      bio: "",
      commissionRate: 0,
      email: "",
      phoneNumber: "",
      specialties: "",
      status: "ACTIVE",
    });

    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/professionals");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nome */}
      <div>
        <Label className="block mb-2">Nome do Profissional</Label>
        <Input {...register("name")} placeholder="Nome do profissional" />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Descrição */}
      <div>
        <Label className="block mb-2">Biografia</Label>
        <Textarea
          {...register("bio")}
          placeholder="Sobre o profissional"
          rows={3}
        />
        {errors.bio && (
          <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <Label className="block mb-2">Email</Label>
        <Input
          {...register("email")}
          placeholder="email@exemplo.com"
          type="email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Telefone */}
      <div>
        <Label className="block mb-2">Telefone</Label>
        <Input {...register("phoneNumber")} placeholder="(00) 00000-0000" />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      {/* Especialidades */}
      <div>
        <Label className="block mb-2">Especialidades</Label>
        <Input
          {...register("specialties")}
          placeholder="Corte, Barba, Coloração, etc"
        />
        {errors.specialties && (
          <p className="text-red-500 text-sm mt-1">
            {errors.specialties.message}
          </p>
        )}
      </div>

      {/* Comissão */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="block mb-2">Comissão (%)</Label>
          <Input
            type="number"
            {...register("commissionRate", { valueAsNumber: true })}
            placeholder="30"
            step="5"
            min="0"
            max="100"
          />
          {errors.commissionRate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.commissionRate.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <Label className="block mb-2">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ACTIVE">Ativo</SelectItem>
                    <SelectItem value="INACTIVE">Inativo</SelectItem>
                    <SelectItem value="ON_LEAVE">Em Licença</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" onClick={handleCancel} variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} variant="default">
          {isSubmitting
            ? "Salvando..."
            : selectedProfessional
            ? "Atualizar Profissional"
            : "Criar Profissional"}
        </Button>
      </div>
    </form>
  );
}
