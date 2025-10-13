"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChangePasswordForm from "./change-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface TemporaryPasswordGuardProps {
  children: React.ReactNode;
}

export default function TemporaryPasswordGuard({
  children,
}: TemporaryPasswordGuardProps) {
  const [hasTemporaryPassword, setHasTemporaryPassword] = useState<
    boolean | null
  >(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkTemporaryPassword();
  }, []);

  const checkTemporaryPassword = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const user = await response.json();
        setHasTemporaryPassword(user.isTemporaryPassword || false);
      }
    } catch (error) {
      console.error("Erro ao verificar senha temporária:", error);
      setHasTemporaryPassword(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChanged = () => {
    setHasTemporaryPassword(false);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (hasTemporaryPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                Ação Necessária
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 text-sm">
                Você está usando uma senha temporária. Por segurança, é
                necessário alterá-la antes de continuar usando o sistema.
              </p>
            </CardContent>
          </Card>

          <ChangePasswordForm
            isTemporaryPassword={true}
            onSuccess={handlePasswordChanged}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
