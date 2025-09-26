import CardPlans from "./_components/CardPlans";
import Image from "next/image";

export default function Plans() {
  return (
    <section id="plans" className="py-16 bg-bg_dark scroll-mt-[120px]">
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
            Nossos Planos
          </p>
        </div>
        <div className="flex lg:flex-row flex-col lg:justify-around justify-center items-center lg:gap-4 gap-8">
          <CardPlans
            title={"BASICO"}
            subTitle={"Até 2 Profissionais"}
            price={"R$59,90"}
            buttonText={"Escolha o Basic"}
            services={[
              { label: "Agendamento Online", iconOption: true },
              { label: "Movimentações", iconOption: true },
              { label: "Pagamentos de Comandas", iconOption: true },
              { label: "Comissões", iconOption: true },
              { label: "Relatórios", iconOption: true },
              { label: "Promoções", iconOption: false },
              { label: "Controle Financeiro", iconOption: false },
              { label: "Controle de Estoque", iconOption: false },
            ]}
          />
          <CardPlans
            title={"STANDARD"}
            subTitle={"Até 5 Profissionais"}
            price={"R$89,90"}
            buttonText={"Escolha o Standard"}
            services={[
              { label: "Agendamento Online", iconOption: true },
              { label: "Movimentações", iconOption: true },
              { label: "Pagamentos de Comandas", iconOption: true },
              { label: "Comissões", iconOption: true },
              { label: "Relatórios", iconOption: true },
              { label: "Promoções", iconOption: true },
              { label: "Controle Financeiro", iconOption: false },
              { label: "Controle de Estoque", iconOption: false },
            ]}
          />
          <CardPlans
            title={"PREMIUM"}
            subTitle={"Até 10 Profissionais"}
            price={"R$129,90"}
            buttonText={"Escolha o Premium"}
            services={[
              { label: "Agendamento Online", iconOption: true },
              { label: "Movimentações", iconOption: true },
              { label: "Pagamentos de Comandas", iconOption: true },
              { label: "Comissões", iconOption: true },
              { label: "Relatórios", iconOption: true },
              { label: "Promoções", iconOption: true },
              { label: "Controle Financeiro", iconOption: true },
              { label: "Controle de Estoque", iconOption: true },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
