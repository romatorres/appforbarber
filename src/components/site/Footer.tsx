"use client";

import Image from "next/image";
import { scrollToSection } from "@/lib/scroll";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-bg-dark py-8" id="footer">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <Link href="#home" onClick={(e) => scrollToSection(e, "#home")}>
            <Image src="/img/logo.svg" alt="Logomarca" width={80} height={60} />
          </Link>
          <div className="text-center text-sm md:text-base text-gray-4">
            © {currentYear} App For Barber. Todos os direitos reservados.
          </div>
          <a
            href="https://romatorres.dev.br"
            target="_blank"
            className="hover:-translate-y-0.5 duration-300"
          >
            <Image
              src="/img/logo_roma.svg"
              alt="Logo Parceiro"
              width={30}
              height={30}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
