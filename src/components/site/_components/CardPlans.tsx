import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface CardPlansProps {
  title: string;
  subTitle: string;
  price: string;
  buttonText: string;
  services: { label: string; iconOption: boolean }[];
}

const CardPlans: React.FC<CardPlansProps> = ({
  title,
  subTitle,
  price,
  buttonText,
  services,
}) => {
  return (
    <div className="rounded-lg bg-secondary border border-gray-1 w-[330px] px-4 py-6 hover:-translate-y-2 duration-200 cursor-pointer">
      <h3 className="text-white font-nunito font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-3 font-nunito text-sm font-semibold mb-6">
        {subTitle}
      </p>
      <Button className="font-nunito w-full">{buttonText}</Button>
      <div className="flex items-end gap-2 my-10">
        <h2 className="text-3xl font-nunito text-white font-bold">{price}</h2>
        <p className="text-lg font-nunito text-gray-3 font-bold"> /mês</p>
      </div>

      <div className="w-full border-t-2 border-gray-1"></div>
      <ul className="flex flex-col gap-3 mt-10">
        {services.map((service, index) => (
          <li
            key={index}
            className="flex items-center gap-2 font-nunito font-semibold text-gray-3"
          >
            {service.iconOption ? (
              <Check color="#FACC15" />
            ) : (
              <X color="#EF4444" />
            )}
            {service.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CardPlans;
