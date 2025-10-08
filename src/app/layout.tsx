import type { Metadata } from "next";
import { Paytone_One, Nunito } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SessionProvider } from "@/components/site/_components/SessionProvider";
import { Session } from "@/store/session-store"; // FIX 1: Added missing import
import { Toaster } from "sonner";

const paytoneOne = Paytone_One({
  variable: "--font-paytone-one",
  subsets: ["latin"],
  weight: "400",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "App For Barber",
  description:
    "Moderno, bonito, inteligente. App For Barber, um app para Barbearias!!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const readonlyHeaders = await headers();
  const mutableHeaders = new Headers(readonlyHeaders);

  const session = await auth.api.getSession({
    headers: mutableHeaders,
  });

  return (
    <html lang="pt-BR">
      <body
        className={`${paytoneOne.variable} ${nunito.variable} font-nunito antialiased`}
      >
        <SessionProvider session={session as Session}>
          {children}
          <Toaster richColors closeButton />
        </SessionProvider>
      </body>
    </html>
  );
}
