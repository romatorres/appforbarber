"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { scrollToSection } from "../../lib/scroll";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative bg-no-repeat bg-cover bg-center py-10 sm:mt-24 mt-16 bg-[url(/img/bg_hero.jpg)] flex items-center"
    >
      <div className="absolute inset-0 bg-background opacity-50"></div>
      <div className="relative w-full max-w-screen-xl mx-auto md:px-12 px-6">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-8">
          <div className="text-white font-paytone-one sm:text-start text-center text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 md:mb-0 md:mr-4 flex-1">
            <h1 className="leading-tight">
              Moderno, bonito, inteligente... <br />
              <span className="text-primary">App For Barber,</span> <br /> um
              app para Barbearias!!
            </h1>
          </div>
          <div className="hidden md:block relative xl:h-[590px] xl:w-[240px] lg:h-[480px] lg:w-[181px] md:h-[400px] md:w-[150px]">
            <Image
              src="/img/mockup01.png"
              alt="Mockup de celular"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center md:justify-start justify-center gap-5 sm:gap-8 mt-4 sm:mx-0 mx-4 font-nunito">
          <Link
            href="#plans"
            className="sm:w-auto w-full"
            onClick={(e) => scrollToSection(e, "#plans")}
          >
            <Button className="px-14 sm:py-7 py-6 sm:w-auto w-full text-lg font-semibold">
              Escolha um Plano
            </Button>
          </Link>
          <Link href="#" className="sm:w-auto w-full">
            <Button
              variant="secondary"
              className="px-10 sm:py-7 py-6 sm:w-auto w-full text-lg font-semibold"
            >
              Veja uma Demonstração
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
