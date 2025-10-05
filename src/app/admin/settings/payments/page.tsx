import { PageTitleAdmin } from "@/components/ui/page-title-admin";

export default function Payments() {
  return (
    <div className="container mx-auto sm:p-4 p-1 space-y-6">
      <PageTitleAdmin
        title="Metodos de Pagamento"
        description="Gerencie as formas de pagamento da sua empresa"
      />
    </div>
  );
}
