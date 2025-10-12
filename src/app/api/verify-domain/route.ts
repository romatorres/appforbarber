import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function GET() {
    try {
        // Verificar se o domínio está configurado corretamente
        const { data, error } = await resend.domains.list();

        if (error) {
            return NextResponse.json({
                success: false,
                error: error.message
            }, { status: 500 });
        }

        const appforbarberDomain = data?.data?.find(
            domain => domain.name === 'appforbarber.com.br'
        );

        if (!appforbarberDomain) {
            return NextResponse.json({
                success: false,
                error: "Domínio appforbarber.com.br não encontrado no Resend",
                availableDomains: data?.data?.map(d => d.name) || []
            });
        }

        return NextResponse.json({
            success: true,
            domain: {
                name: appforbarberDomain.name,
                status: appforbarberDomain.status,
                verified: appforbarberDomain.status === 'verified',
                createdAt: appforbarberDomain.createdAt
            },
            message: appforbarberDomain.status === 'verified'
                ? "Domínio verificado e pronto para uso!"
                : `Domínio em status: ${appforbarberDomain.status}`
        });

    } catch (error) {
        console.error("Erro ao verificar domínio:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Erro desconhecido"
        }, { status: 500 });
    }
}