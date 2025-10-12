import { NextResponse } from "next/server";
import { resend, EMAIL_CONFIG } from "@/lib/resend";

export async function POST(req: Request) {
    try {
        const { to } = await req.json();

        if (!to) {
            return NextResponse.json({ error: "Email destinatário é obrigatório" }, { status: 400 });
        }

        console.log("Testando envio de email...");
        console.log("API Key:", process.env.RESEND_API_KEY ? "Configurada" : "Não configurada");
        console.log("From:", EMAIL_CONFIG.from);
        console.log("To:", to);

        const { data, error } = await resend.emails.send({
            from: EMAIL_CONFIG.from,
            to: [to],
            subject: "🧪 Teste de Email - App For Barber",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #2563eb;">🧪 Teste de Email</h1>
                    <p>Este é um email de teste para verificar se a configuração do Resend está funcionando.</p>
                    <p><strong>Configurações:</strong></p>
                    <ul>
                        <li>From: ${EMAIL_CONFIG.from}</li>
                        <li>Reply To: ${EMAIL_CONFIG.replyTo}</li>
                        <li>Timestamp: ${new Date().toISOString()}</li>
                    </ul>
                    <p>Se você recebeu este email, a configuração está funcionando! ✅</p>
                </div>
            `,
            text: `
Teste de Email - App For Barber

Este é um email de teste para verificar se a configuração do Resend está funcionando.

Configurações:
- From: ${EMAIL_CONFIG.from}
- Reply To: ${EMAIL_CONFIG.replyTo}
- Timestamp: ${new Date().toISOString()}

Se você recebeu este email, a configuração está funcionando! ✅
            `.trim(),
        });

        if (error) {
            console.error("Erro do Resend:", error);
            return NextResponse.json({
                success: false,
                error: error.message,
                details: error
            }, { status: 500 });
        }

        console.log("Email enviado com sucesso:", data);
        return NextResponse.json({
            success: true,
            messageId: data?.id,
            message: "Email de teste enviado com sucesso!"
        });

    } catch (error) {
        console.error("Erro inesperado:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Erro desconhecido"
        }, { status: 500 });
    }
}