import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { Role } from "@/generated/prisma";

const protectedRoutes = ["/admin"];

// Rotas que requerem roles específicas
const roleBasedRoutes: Record<string, Role[]> = {
  "/admin/settings": [Role.SUPER_ADMIN, Role.ADMIN],
  // Adicione mais rotas conforme necessário
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      // Verificar se há sessão válida
      if (!session?.userId) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Verificações específicas por rota baseadas em role
      for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
        if (pathname.startsWith(route)) {
          // Buscar dados do usuário para verificar role
          const { prisma } = await import("@/lib/prisma");
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { role: true },
          });

          if (!user || !allowedRoles.includes(user.role)) {
            return NextResponse.redirect(new URL("/admin", request.url));
          }
        }
      }
    } catch (error) {
      console.error("Middleware auth error:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
