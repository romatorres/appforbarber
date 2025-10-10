import { PageTitleAdmin } from "@/components/ui/page-title-admin";
import ProfessionalList from "./professional-list";
import ProfessionalForm from "./professional-form";

export default function ProfessionalPage() {
  return (
    <div className="container mx-auto sm:p-4 p-1 space-y-6">
      <PageTitleAdmin
        title="Profissionais"
        description="Gerencie os profissionais da sua empresa"
      ></PageTitleAdmin>
      <ProfessionalList />
      <ProfessionalForm />
    </div>
  );
}
