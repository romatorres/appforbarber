"use client";

import ChangePasswordForm from "@/components/auth/change-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitleAdmin } from "@/components/ui/page-title-admin";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PasswordSettingsPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto sm:p-4 p-1 space-y-6 flex flex-col">
      <PageTitleAdmin
        title="Configurações de Senha"
        description="Altere sua senha para manter sua conta segura."
      ></PageTitleAdmin>

      {/* Dicas de Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Dicas de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Use pelo menos 8 caracteres</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Combine letras maiúsculas e minúsculas</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Inclua números e símbolos</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Evite informações pessoais óbvias</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Use uma senha única para cada conta</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-6">
        {/* Formulário de Mudança de Senha */}
        <ChangePasswordForm
          onSuccess={() => {
            // Redirecionar ou mostrar mensagem de sucesso
            router.push("/admin");
          }}
          onCancel={() => {
            router.back();
          }}
        />
      </div>
    </div>
  );
}
