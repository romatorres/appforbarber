import { handleApiError, getAuthenticatedUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET para obter dados do usuário logado
export async function GET() {
    try {
        const user = await getAuthenticatedUser();

        // Buscar dados completos do usuário
        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailVerified: true,
                isTemporaryPassword: true,
                companyId: true,
                createdAt: true,
                updatedAt: true,
                company: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
        });

        if (!userData) {
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(userData);
    } catch (error) {
        return handleApiError(error);
    }
}