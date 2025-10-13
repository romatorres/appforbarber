"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import { toast } from "sonner";

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(8, "Nova senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Nova senha e confirmação devem ser iguais",
    path: ["confirmPassword"],
  });

type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;

interface ChangePasswordFormProps {
  isTemporaryPassword?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ChangePasswordForm({
  isTemporaryPassword = false,
  onSuccess,
  onCancel,
}: ChangePasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    errors: string[];
  }>({ score: 0, errors: [] });

  const form = useForm<ChangePasswordData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Validar força da senha em tempo real
  const validatePasswordStrength = (password: string) => {
    const errors: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else if (password.length > 0) errors.push("Pelo menos 8 caracteres");

    if (/[a-z]/.test(password)) score += 1;
    else if (password.length > 0) errors.push("Uma letra minúscula");

    if (/[A-Z]/.test(password)) score += 1;
    else if (password.length > 0) errors.push("Uma letra maiúscula");

    if (/\d/.test(password)) score += 1;
    else if (password.length > 0) errors.push("Um número");

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
    else if (password.length > 0) errors.push("Um caractere especial");

    if (password.length >= 12) score += 1;

    setPasswordStrength({ score, errors });
  };

  const onSubmit = async (data: ChangePasswordData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Senha alterada com sucesso!");
        form.reset();
        onSuccess?.();
      } else {
        toast.error(result.message || result.error || "Erro ao alterar senha");

        // Se for erro de senha atual, focar no campo
        if (result.error?.includes("atual")) {
          form.setFocus("currentPassword");
        }
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      toast.error("Erro inesperado ao alterar senha");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 2) return "text-red-600";
    if (score <= 4) return "text-yellow-600";
    return "text-green-600";
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 2) return "Fraca";
    if (score <= 4) return "Média";
    return "Forte";
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isTemporaryPassword ? (
            <>
              <Shield className="h-5 w-5 text-orange-600" />
              Alterar Senha Temporária
            </>
          ) : (
            <>
              <Lock className="h-5 w-5" />
              Alterar Senha
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isTemporaryPassword && (
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Por segurança, você deve alterar sua senha temporária antes de
              continuar usando o sistema.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Senha Atual */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isTemporaryPassword ? "Senha Temporária" : "Senha Atual"}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder={
                          isTemporaryPassword
                            ? "Digite a senha do email"
                            : "Digite sua senha atual"
                        }
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nova Senha */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Digite sua nova senha"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          validatePasswordStrength(e.target.value);
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />

                  {/* Indicador de força da senha */}
                  {field.value && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span>Força:</span>
                        <span
                          className={getPasswordStrengthColor(
                            passwordStrength.score
                          )}
                        >
                          {getPasswordStrengthText(passwordStrength.score)}
                        </span>
                      </div>
                      {passwordStrength.errors.length > 0 && (
                        <div className="mt-1 text-xs text-gray-600">
                          <span>Faltam: </span>
                          {passwordStrength.errors.join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </FormItem>
              )}
            />

            {/* Confirmar Nova Senha */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Nova Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Digite novamente sua nova senha"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              {onCancel && !isTemporaryPassword && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Alterando..." : "Alterar Senha"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
