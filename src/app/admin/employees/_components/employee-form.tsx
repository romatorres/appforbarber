"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateEmployeeSchema,
  InviteEmployeeSchema,
  CreateEmployeeData,
  UpdateEmployeeData,
  InviteEmployeeData,
} from "@/schemas/employee-schema";
import { useEmployeeStore } from "@/store/employee-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Shield } from "lucide-react";

interface EmployeeFormProps {
  onSuccess?: () => void;
}

// Tipo de união para os dados do formulário
type EmployeeFormData =
  | CreateEmployeeData
  | UpdateEmployeeData
  | InviteEmployeeData;

export default function EmployeeForm({ onSuccess }: EmployeeFormProps) {
  const { inviteEmployee, selectedEmployee, updateEmployee, selectEmployee } =
    useEmployeeStore();

  const isEdit = !!selectedEmployee;

  // Escolher schema baseado no modo
  const getSchema = () => {
    if (isEdit) return UpdateEmployeeSchema;
    return InviteEmployeeSchema; // Sempre usar schema de convite para criação
  };

  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      bio: "",
      commissionRate: 50,
      specialties: "",
      status: "ACTIVE" as const,
      hasSystemAccess: true, // Sempre true por padrão
      sendInvite: true, // Sempre enviar convite
      temporaryPassword: "",
    },
  });

  // Resetar formulário quando funcionário selecionado muda
  useEffect(() => {
    if (selectedEmployee) {
      form.reset({
        name: selectedEmployee.name || "",
        email: selectedEmployee.email || "",
        phoneNumber: selectedEmployee.phoneNumber || "",
        bio: selectedEmployee.bio || "",
        commissionRate: selectedEmployee.commissionRate || 50,
        specialties: selectedEmployee.specialties || "",
        status: selectedEmployee.status || "ACTIVE",
        hasSystemAccess: selectedEmployee.hasSystemAccess || false,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        phoneNumber: "",
        bio: "",
        commissionRate: 30,
        specialties: "",
        status: "ACTIVE",
        hasSystemAccess: true,
        sendInvite: true,
        temporaryPassword: "",
      });
    }
  }, [selectedEmployee, form]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      if (isEdit && selectedEmployee) {
        // Atualizar funcionário existente
        const updateData: UpdateEmployeeData = {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          bio: data.bio,
          commissionRate: data.commissionRate,
          specialties: data.specialties,
          status: data.status,
          hasSystemAccess: data.hasSystemAccess,
        };
        await updateEmployee(selectedEmployee.id, updateData);
      } else {
        // Criar novo funcionário (sempre com convite)
        const inviteData: InviteEmployeeData = {
          ...data,
          sendInvite: true,
          hasSystemAccess: true,
        };
        await inviteEmployee(inviteData);
      }

      // Limpar formulário e fechar
      form.reset();
      selectEmployee(null);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
    }
  };

  const handleCancel = () => {
    form.reset();
    selectEmployee(null);
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="funcionario@empresa.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biografia</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Breve descrição sobre o funcionário..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Informações Profissionais */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="commissionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxa de Comissão (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Ativo</SelectItem>
                      <SelectItem value="INACTIVE">Inativo</SelectItem>
                      <SelectItem value="ON_LEAVE">Afastado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="specialties"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidades</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Corte masculino, Barba, Coloração..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Informação sobre acesso automático */}
        {!isEdit && (
          <>
            <Separator />
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Acesso Automático ao Sistema
                </span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                Todo funcionário receberá automaticamente acesso ao sistema com
                um convite por email contendo suas credenciais de login.
              </p>
            </div>
          </>
        )}

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" onClick={handleCancel} variant="outline">
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Salvando..."
              : isEdit
                ? "Atualizar Funcionário"
                : "Criar Funcionário"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
