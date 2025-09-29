import type { Metadata } from "next";
import { Paytone_One, Nunito } from "next/font/google";
import "./globals.css";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${paytoneOne.variable} ${nunito.variable} font-nunito antialiased`}
      >
        {children}
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
