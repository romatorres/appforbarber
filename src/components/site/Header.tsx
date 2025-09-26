"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { AlignRight, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLUListElement | null>(null); // Referência para o menu

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Checar inicialmente
    checkIfMobile();

    // Adicionar listener para resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Fechar o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Garantindo que o menuRef seja do tipo HTMLElement
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-background text-white font-nunito py-2 fixed w-full top-0 left-0 z-50">
      <nav className="max-w-screen-xl mx-auto flex justify-between items-center md:px-12 px-6">
        <div className="text-lg font-bold">
          <Link href="/">
            <div className="relative sm:w-28 sm:h-20 w-20 h-14">
              <Image
                src="/img/logo.svg"
                alt="Logomarca"
                fill
                className="object-cover"
              />
            </div>
          </Link>
        </div>

        {/* Botão Mobile */}
        {isMobile && (
          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X /> : <AlignRight />}
          </button>
        )}

        {/* Menu de Navegação */}
        <ul
          ref={menuRef} // Referência do menu
          className={`${
            isMobile
              ? `absolute top-20 left-0 right-0 bg-background z-50 flex flex-col items-center ${
                  isMenuOpen
                    ? "translate-y-0 opacity-100 visible transition-all duration-300"
                    : "-translate-y-10 opacity-0 invisible"
                }`
              : "flex flex-row opacity-100 visible static"
          }`}
        >
          <li>
            <Link
              href="#hero"
              className="block px-4 py-2 text-lg hover:text-primary duration-300"
              onClick={(e) => scrollToSection(e, "#hero")}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="#about"
              className="block px-4 py-2 text-lg hover:text-primary duration-300"
              onClick={(e) => scrollToSection(e, "#about")}
            >
              Sobre
            </Link>
          </li>
          <li>
            <Link
              href="#plans"
              className="block px-4 py-2 text-lg hover:text-primary duration-300"
              onClick={(e) => scrollToSection(e, "#plans")}
            >
              Planos
            </Link>
          </li>
          <li>
            <Link
              href="#contacts"
              className="block px-4 py-2 text-lg hover:text-primary duration-300"
              onClick={(e) => scrollToSection(e, "#contacts")}
            >
              Contato
            </Link>
          </li>
          <li className="py-6 md:py-0 md:pl-8 pl-0">
            <Link href="/login" className="block px-4">
              <Button variant="outline" className="px-8">
                Entrar
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
