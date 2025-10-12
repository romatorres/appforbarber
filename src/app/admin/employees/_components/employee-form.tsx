"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateEmployeeSchema,
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Shield, Mail } from "lucide-react";

interface EmployeeFormProps {
  onSuccess?: () => void;
}

// Tipo de união para os dados do formulário
type EmployeeFormData =
  | CreateEmployeeData
  | UpdateEmployeeData
  | InviteEmployeeData;

export default function EmployeeForm({ onSuccess }: EmployeeFormProps) {
  const {
    createEmployee,
    inviteEmployee,
    selectedEmployee,
    updateEmployee,
    selectEmployee,
  } = useEmployeeStore();

  const [sendInvite, setSendInvite] = useState(false);
  const isEdit = !!selectedEmployee;

  // Escolher schema baseado no modo
  const getSchema = () => {
    if (isEdit) return UpdateEmployeeSchema;
    return sendInvite ? InviteEmployeeSchema : CreateEmployeeSchema;
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
      hasSystemAccess: false,
      ...(sendInvite && {
        sendInvite: false,
        temporaryPassword: "",
      }),
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
      setSendInvite(selectedEmployee.hasSystemAccess || false);
    } else {
      form.reset({
        name: "",
        email: "",
        phoneNumber: "",
        bio: "",
        commissionRate: 30,
        specialties: "",
        status: "ACTIVE",
        hasSystemAccess: false,
      });
      setSendInvite(false);
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
        // Criar novo funcionário
        if (sendInvite) {
          // Criar com convite
          const inviteData: InviteEmployeeData = {
            ...data,
            sendInvite: true,
            hasSystemAccess: true,
          };
          await inviteEmployee(inviteData);
        } else {
          // Criar simples
          const createData: CreateEmployeeData = {
            name: data.name || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber,
            bio: data.bio,
            commissionRate: data.commissionRate || 30,
            specialties: data.specialties,
            status: data.status || "ACTIVE",
            hasSystemAccess: false,
            startDate: new Date(),
          };
          await createEmployee(createData);
        }
      }

      // Limpar formulário e fechar
      form.reset();
      selectEmployee(null);
      setSendInvite(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
    }
  };

  const handleCancel = () => {
    form.reset();
    selectEmployee(null);
    setSendInvite(false);
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

        {/* Acesso ao Sistema - apenas para criação */}
        {!isEdit && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <h3 className="text-md font-medium">Acesso ao Sistema</h3>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="sendInvite"
                  checked={sendInvite}
                  onCheckedChange={(checked: boolean) => {
                    setSendInvite(checked);
                    form.setValue("hasSystemAccess", checked);
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="sendInvite"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Conceder acesso ao sistema
                  </Label>
                  <p className="text-xs text-gray-3">
                    O funcionário poderá fazer login e usar o sistema
                  </p>
                </div>
              </div>

              {sendInvite && (
                <div className="p-3 bg-gray-1 rounded-lg border border-gray-2">
                  <div className="flex items-center gap-2 text-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Convite por Email
                    </span>
                  </div>
                  <p className="text-xs text-gray-4 mt-1">
                    Um convite será enviado por email com as credenciais de
                    acesso. Uma senha temporária será gerada automaticamente.
                  </p>
                </div>
              )}
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
              : sendInvite
              ? "Criar e Enviar Convite"
              : "Criar Funcionário"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
