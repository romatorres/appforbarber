import { PageTitleAdmin } from "@/components/ui/page-title-admin";

export default function Company() {
  return (
    <div className="container mx-auto sm:p-4 p-1 space-y-6">
      <PageTitleAdmin
        title="Empresa"
        description="Gerencie os dados da sua empresa"
      />
    </div>
  );
}
