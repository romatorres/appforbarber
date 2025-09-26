import { SiWhatsapp, SiMaildotru } from "react-icons/si";
import Image from "next/image";

export default function Contacts() {
  return (
    <section
      id="contacts"
      className="py-16 bg-cover bg-center scroll-mt-[120px] bg-[url(/img/bg_contatos.png)]"
    >
      <div className="max-w-screen-xl mx-auto md:px-12 px-6">
        <div className="flex flex-col items-center justify-center md:mb-20 mb-10">
          <div className="relative md:h-[110px] h-[64px] md:w-[230px] w-[130px]">
            <Image
              src="/img/icon_logo.png"
              alt="Icone da Logo"
              fill
              className="md:w-[230px] w-[150px]"
            />
          </div>
          <p className="font-paytone-one text-white md:text-5xl text-3xl">
            Contatos
          </p>
        </div>
        <div className="flex lg:flex-row flex-col lg:justify-between justify-center items-center">
          <div className="flex flex-col gap-5 lg:order-1 order-2 lg:mt-0 mt-12 font-nunito">
            <a href="#">
              <p className="flex items-center md:gap-4 gap-1 md:text-2xl text-xl font-medium text-white duration-300 hover:-translate-0.5">
                <SiMaildotru className="w-7 h-7" />
                contato@appforbarber.com.br
              </p>
            </a>
            <a href="#">
              <p className="flex items-center md:gap-4 gap-1 md:text-2xl text-xl font-medium text-white duration-300 hover:-translate-0.5">
                <SiWhatsapp className="w-7 h-7" />
                75 99900-9900
              </p>
            </a>
          </div>
          <div className="flex flex-col gap-3 lg:order-2 order-1">
            <p className="md:text-2xl text-xl font-nunito font-normal text-white">
              Social
            </p>
            <div className="flex items-center md:gap-10 gap-6">
              <a
                href="#"
                className="relative h-12 w-12 transition-transform duration-300 hover:scale-110"
              >
                <Image src="/img/face.svg" alt="Icon Face" fill />
              </a>
              <a
                href="#"
                className="relative h-12 w-12 transition-transform duration-300 hover:scale-110"
              >
                <Image src="/img/x.svg" alt="Icon x" fill />
              </a>
              <a
                href="#"
                className="relative h-12 w-12 transition-transform duration-300 hover:scale-110"
              >
                <Image src="/img/insta.svg" alt="Icon Instagram" fill />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
