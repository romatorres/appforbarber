"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AlignRight, X } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Effect to disable body scroll when menu is open on mobile
  useEffect(() => {
    if (isMenuOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

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
          <Link href="#hero" onClick={(e) => scrollToSection(e, "#hero")}>
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

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none z-[60]" // High z-index to be on top of everything
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMenuOpen ? <X /> : <AlignRight />}
        </button>

        {/* Overlay de fundo (mobile) */}
        {isMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/80 z-40"
            onClick={toggleMenu}
          />
        )}

        {/* Menu de Navegação */}
        <ul
          className={`
            flex items-center md:flex-row md:static md:w-auto md:h-auto md:bg-transparent md:p-0 md:translate-x-0 md:opacity-100 md:pointer-events-auto absolute top-0 right-0 w-3/4 max-w-xs h-screen bg-background/95 z-50 flex-col justify-start pt-20 gap-6 transition-transform duration-300 ease-in-out
            ${
              isMenuOpen
                ? "translate-x-0"
                : "translate-x-full pointer-events-none"
            }
          `}
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
        </ul>
      </nav>
    </header>
  );
}
