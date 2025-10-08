import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CompanyData } from "@/schemas/company-schema";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { EllipsisVertical } from "lucide-react";

interface CompanyDetailsProps {
  company: CompanyData;
  onEdit: () => void;
}

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-md font-semibold">{value || "-"}</p>
  </div>
);

export const CompanyDetails = ({ company, onEdit }: CompanyDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Dados da Empresa</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <EllipsisVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DetailItem label="Nome da Empresa" value={company.name} />
          <DetailItem label="CNPJ" value={company.cnpj} />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DetailItem label="Email" value={company.email} />
          <DetailItem label="Telefone" value={company.phone} />
        </div>
        <hr />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <DetailItem label="Endereço" value={company.address} />
          <DetailItem label="Cidade" value={company.city} />
          <DetailItem label="Estado" value={company.state} />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <DetailItem label="CEP" value={company.zipCode} />
        </div>
      </CardContent>
    </Card>
  );
};
