"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, MoreHorizontal } from "lucide-react";
import { useServiceStore } from "@/store/service-store";
import type { ServiceData as Service } from "@/schemas/service-schema";
import { formatCurrency } from "@/lib/utils";

export default function ServiceList() {
  const { services, selectedService, deleteService, selectService } =
    useServiceStore();

  const handleDelete = async (service: Service) => {
    if (
      confirm(`Tem certeza que deseja excluir o serviço "${service.name}"?`)
    ) {
      try {
        await deleteService(service.id);
      } catch (error) {
        console.error("Erro ao excluir serviço:", error);
      }
    }
  };

  const handleEdit = (service: Service) => {
    selectService(service);
  };

  return (
    <div>
      <Card>
        <div className="space-y-4 p-3 sm:p-6">
          {services.length === 0 ? (
            <CardContent className="p-4 text-center text-gray-500">
              Nenhum serviço cadastrado
            </CardContent>
          ) : (
            services.map((service: Service) => (
              <Card
                key={service.id}
                className={`p-4 border ${
                  selectedService?.id === service.id
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }`}
              >
                <CardContent className="p-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {service.description}
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(service)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(service)}
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-600" />
                          <p className="text-gray-900 font-bold">
                            {formatCurrency(service.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <p className="text-gray-600 font-semibold">
                            {service.duration} min
                          </p>
                        </div>
                      </div>

                      <div>
                        <Badge
                          variant={service.active ? "default" : "destructive"}
                        >
                          {service.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
