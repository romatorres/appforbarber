import type { Metadata } from "next";
import { Paytone_One, Nunito } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AuthProvider } from "@/components/providers/AuthProvider";
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
        <AuthProvider initialSession={session}>
          {children}
          <Toaster richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
