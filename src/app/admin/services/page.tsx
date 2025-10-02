import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import ServiceList from "./_components/service-list";

export default function Services() {
  return (
    <div className="container mx-auto p-4">
      <div className="w-full space-y-8">
        <div className="flex md:flex-row flex-col md:items-center items-start md:justify-between justify-center md:gap-0 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
            <p className="text-gray-3 mt-1">
              Gerencie todos os serviços do sistema
            </p>
          </div>
          <Link href={"/dashboard/services/new/"} className="md:w-fit w-full">
            <Button className="w-full">
              <Plus />
              Serviço
            </Button>
          </Link>
        </div>
        <ServiceList />
      </div>
    </div>
  );
}
