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
import { Clock, DollarSign, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useServiceStore } from "@/store/service-store";

export default function ServiceList() {
  const {
    services,
    loading,
    error,
    selectedService,
    fetchServices,
    createServices,
    updateServices,
    deleteService,
    selectService,
  } = useServiceStore();
  return (
    <div>
      <Card>
        <div className="space-y-4 p-3 sm:p-6">
          {services.map((service) => (
            <CardContent key={service.id} className="p-4">
              <div className="space-y-2 mb-4 sm:mb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <p className="text-sm text-gray-4">{service.description}</p>
                  </div>
                  {/* Menu Dropdown */}
                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedService(service);
                            setShowEditDialog(true);
                          }}
                        >
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
                  )}
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-4" />
                      <p className="text-price font-bold">
                        {formatCurrency(service.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-4" />
                      <p className="text-gray-4 font-semibold">
                        {service.duration} min
                      </p>
                    </div>
                  </div>
                  {/* <div>
                    <CustomBadge
                      variant={service.active ? "success" : "destructive"}
                    >
                      {service.active ? "Ativo" : "Inativo"}
                    </CustomBadge>
                  </div> */}
                </div>
              </div>
            </CardContent>
          ))}
        </div>
      </Card>
    </div>
  );
}
