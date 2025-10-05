import { PageTitleAdmin } from "@/components/ui/page-title-admin";
import { CompanyService } from "@/services/company-service";
import CompanyForm from "./_components/company-form";
import { CompanySetup } from "./_components/company-setup";

export default async function Company() {
  const company = await CompanyService.getCompany();

  return (
    <div>
      <PageTitleAdmin
        title="Empresa"
        description="Gerencie os dados da sua empresa"
      />
      <div className="mt-8">
        {company ? <CompanyForm company={company} /> : <CompanySetup />}
      </div>
    </div>
  );
}