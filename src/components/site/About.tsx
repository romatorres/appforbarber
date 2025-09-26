import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-16 scroll-mt-28">
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
            Sobre Nós
          </p>
        </div>

        <div className="flex lg:flex-row flex-col lg:justify-between justify-center items-center gap-4">
          <div className="relative h-[600px] w-full max-w-[280px] lg:order-1 order-2 lg:mt-0 mt-7">
            <Image src="/img/mockup02.png" alt="Telefone com imagens" fill />
          </div>

          <div className="w-full max-w-[790px] lg:order-2 order-1">
            <h2 className="font-paytone-one text-white md:text-4xl text-2xl leading-normal">
              Agora ficou fácil agendar e administrar sua barbearia. Aqui,
              combinamos tecnologia de ponta, com um design arrojado e
              intuitivo.
            </h2>

            <div className="flex flex-col gap-5 md:mt-16 mt-10">
              <div className="flex items-center md:gap-6 gap-2 py-2 md:px-6 px-2 rounded-lg bg-secondary border border-gray-1">
                <div className="relative md:h-[60px] h-10 md:w-[60px] w-10 flex-shrink-0">
                  <Image src="/img/icon-agenda.png" alt="Icone Agenda" fill />
                </div>
                <p className="text-white md:text-2xl text-lg md:font-bold font-semibold">
                  Agenda fácil para seus clientes
                </p>
              </div>

              <div className="flex items-center md:gap-6 gap-2 py-2 md:px-6 px-2 rounded-lg bg-secondary border border-gray-1">
                <div className="relative md:h-[60px] h-10 md:w-[60px] w-10 flex-shrink-0">
                  <Image
                    src="/img/icon-dashboard.png"
                    alt="Icone Agenda"
                    fill
                  />
                </div>
                <p className="text-white lg:text-2xl md:text-xl text-base md:font-bold font-semibold">
                  Painel de controle completo e descomplicado
                </p>
              </div>

              <div className="flex items-center md:gap-6 gap-2 py-2 md:px-6 px-2 rounded-lg bg-secondary border border-gray-1">
                <div className="relative md:h-[60px] h-10 md:w-[60px] w-10 flex-shrink-0">
                  <Image src="/img/icon-config.png" alt="Icone Agenda" fill />
                </div>
                <p className="text-white md:text-2xl text-lg md:font-bold font-semibold">
                  Administre os serviços, agendas, clientes, porfissionais,
                  comissões...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
