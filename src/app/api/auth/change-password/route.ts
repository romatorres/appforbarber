import { handleApiError, getAuthenticatedUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { PasswordUtils } from "@/lib/password-utils";
import { BetterAuthUtils } from "@/lib/better-auth-utils";
import { z } from "zod";

const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z.string().min(8, "Nova senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Nova senha e confirmação devem ser iguais",
    path: ["confirmPassword"],
});

// POST para alterar senha do usuário logado
export async function POST(req: Request) {
    try {
        const user = await getAuthenticatedUser();
        const body = await req.json();

        // Validar dados de entrada
        const validatedData = ChangePasswordSchema.parse(body);

        // Buscar usuário
        const currentUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                isTemporaryPassword: true,
                email: true,
                name: true
            },
        });

        if (!currentUser) {
            return NextResponse.json(
                {
                    error: "Usuário não encontrado",
                    message: "Não foi possível encontrar sua conta."
                },
                { status: 400 }
            );
        }

        // Validar força da nova senha
        const passwordValidation = PasswordUtils.validatePasswordStrength(validatedData.newPassword);
        if (!passwordValidation.isValid) {
            return NextResponse.json(
                {
                    error: "Nova senha não atende aos critérios de segurança",
                    message: "Sua nova senha deve ser mais forte.",
                    details: passwordValidation.errors
                },
                { status: 400 }
            );
        }

        // Verificar se a nova senha é diferente da atual
        if (validatedData.currentPassword === validatedData.newPassword) {
            return NextResponse.json(
                {
                    error: "Nova senha deve ser diferente da atual",
                    message: "Escolha uma senha diferente da que você está usando atualmente."
                },
                { status: 400 }
            );
        }

        // Usar Better Auth Utils para alterar senha
        const changeResult = await BetterAuthUtils.changePassword({
            userId: user.id,
            email: currentUser.email,
            currentPassword: validatedData.currentPassword,
            newPassword: validatedData.newPassword,
        });

        if (!changeResult.success) {
            return NextResponse.json(
                {
                    error: changeResult.error,
                    message: changeResult.error === "Senha atual incorreta"
                        ? "A senha atual informada está incorreta."
                        : "Não foi possível alterar sua senha. Tente novamente."
                },
                { status: 400 }
            );
        }

        // Se o usuário foi recriado, os flags já foram atualizados no BetterAuthUtils

        return NextResponse.json({
            success: true,
            message: "Senha alterada com sucesso!",
            wasTemporary: currentUser.isTemporaryPassword || false
        });

    } catch (error) {
        console.error("Erro ao alterar senha:", error);
        return handleApiError(error);
    }
}