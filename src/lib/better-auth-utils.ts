import { auth } from "@/lib/auth";

/**
 * Utilitários para integração com Better Auth
 */
export class BetterAuthUtils {
    /**
     * Criar usuário com senha usando Better Auth
     */
    static async createUserWithPassword(data: {
        name: string;
        email: string;
        password: string;
    }) {
        try {
            const result = await auth.api.signUpEmail({
                body: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                },
                headers: new Headers(),
            });

            return {
                success: true,
                user: result?.user,
                token: result?.token
            };
        } catch (error) {
            console.error("Erro ao criar usuário via Better Auth:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erro desconhecido"
            };
        }
    }

    /**
     * Verificar login (validar senha)
     */
    static async verifyLogin(email: string, password: string) {
        try {
            const result = await auth.api.signInEmail({
                body: {
                    email,
                    password,
                },
                headers: new Headers(),
            });

            return {
                success: true,
                user: result?.user,
                token: result?.token
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Credenciais inválidas"
            };
        }
    }

    /**
     * Alterar senha recriando a conta completamente
     */
    static async changePassword(data: {
        userId: string;
        currentPassword: string;
        newPassword: string;
        email: string;
    }) {
        try {
            // Primeiro verificar se a senha atual está correta
            const loginCheck = await this.verifyLogin(data.email, data.currentPassword);
            if (!loginCheck.success) {
                return {
                    success: false,
                    error: "Senha atual incorreta"
                };
            }

            const { prisma } = await import("@/lib/prisma");

            // Buscar dados do usuário
            const user = await prisma.user.findUnique({
                where: { id: data.userId },
                select: {
                    name: true,
                    email: true,
                    role: true,
                    companyId: true,
                    isTemporaryPassword: true
                }
            });

            if (!user) {
                return {
                    success: false,
                    error: "Usuário não encontrado"
                };
            }

            // Deletar conta de credenciais atual
            await prisma.account.deleteMany({
                where: {
                    userId: data.userId,
                    providerId: "credential"
                }
            });

            // Deletar o usuário atual (mas salvar os dados)
            await prisma.user.delete({
                where: { id: data.userId }
            });

            // Recriar usuário com nova senha usando Better Auth
            const newUserResult = await this.createUserWithPassword({
                name: user.name,
                email: user.email,
                password: data.newPassword,
            });

            if (!newUserResult.success || !newUserResult.user) {
                // Se falhar, tentar recriar o usuário original
                await prisma.user.create({
                    data: {
                        id: data.userId,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        companyId: user.companyId,
                        isTemporaryPassword: user.isTemporaryPassword,
                    }
                });

                return {
                    success: false,
                    error: "Erro ao recriar usuário com nova senha"
                };
            }

            // Atualizar o novo usuário com os dados corretos
            await prisma.user.update({
                where: { id: newUserResult.user.id },
                data: {
                    role: user.role,
                    companyId: user.companyId,
                    isTemporaryPassword: false, // Não é mais senha temporária
                    emailVerified: true,
                }
            });

            // Atualizar referências do funcionário para o novo usuário
            await prisma.employee.updateMany({
                where: { userId: data.userId },
                data: { userId: newUserResult.user.id }
            });

            return {
                success: true,
                message: "Senha alterada com sucesso",
                newUserId: newUserResult.user.id
            };
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erro ao alterar senha"
            };
        }
    }
}