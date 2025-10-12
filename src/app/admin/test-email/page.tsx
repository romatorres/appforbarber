"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function TestEmailPage() {
    const [email, setEmail] = useState("romatorres12@gmail.com");
    const [loading, setLoading] = useState(false);
    const [domainStatus, setDomainStatus] = useState<any>(null);
    const [checkingDomain, setCheckingDomain] = useState(false);

    const handleTestEmail = async () => {
        if (!email) {
            toast.error("Digite um email para teste");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/test-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ to: email }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Email de teste enviado com sucesso!");
                console.log("Resultado:", result);
            } else {
                toast.error(`Erro: ${result.error}`);
                console.error("Erro:", result);
            }
        } catch (error) {
            toast.error("Erro ao enviar email de teste");
            console.error("Erro:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyDomain = async () => {
        setCheckingDomain(true);
        try {
            const response = await fetch("/api/verify-domain");
            const result = await response.json();
            
            setDomainStatus(result);
            
            if (result.success && result.domain.verified) {
                toast.success("Domínio verificado e pronto para uso!");
            } else if (result.success) {
                toast.warning(`Domínio em status: ${result.domain.status}`);
            } else {
                toast.error(`Erro: ${result.error}`);
            }
        } catch (error) {
            toast.error("Erro ao verificar domínio");
            console.error("Erro:", error);
        } finally {
            setCheckingDomain(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>🧪 Teste de Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Button 
                            onClick={handleVerifyDomain} 
                            disabled={checkingDomain}
                            variant="outline"
                            className="w-full"
                        >
                            {checkingDomain ? "Verificando..." : "🌐 Verificar Domínio appforbarber.com.br"}
                        </Button>
                        
                        {domainStatus && (
                            <div className={`p-3 rounded-md text-sm ${
                                domainStatus.success && domainStatus.domain?.verified 
                                    ? 'bg-green-50 text-green-800 border border-green-200' 
                                    : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                            }`}>
                                {domainStatus.success ? (
                                    <div>
                                        <p><strong>Status:</strong> {domainStatus.domain.status}</p>
                                        <p><strong>Verificado:</strong> {domainStatus.domain.verified ? '✅ Sim' : '⏳ Não'}</p>
                                    </div>
                                ) : (
                                    <p>❌ {domainStatus.error}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium">Email para teste:</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu-email@gmail.com"
                        />
                    </div>
                    <Button 
                        onClick={handleTestEmail} 
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? "Enviando..." : "📧 Enviar Email de Teste"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}