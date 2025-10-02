import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user && user?.id) {
        const userProfile = await prisma.user.findUnique({
          where: { id: user.id },
        });
        if (userProfile) {
          (session.user as any).companyId = userProfile.companyId;
        }
      }
      return session;
    },
  },
});
