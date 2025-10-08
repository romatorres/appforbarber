"use client";

import { useEffect, useState } from "react";
import { PageTitleAdmin } from "@/components/ui/page-title-admin";
import { CompanyService } from "@/services/company-service";
import { CompanySetup } from "./_components/company-setup";
import { BranchList } from "./_components/branch-list";
import { CompanyDetails } from "./_components/company-details";
import CompanyForm from "./_components/company-form";
import { CompanyData } from "@/schemas/company-schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Company() {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const data = await CompanyService.getCompany();
        setCompany(data);
      } catch (error) {
        console.error("Failed to fetch company data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  // Recarrega os dados da empresa após a edição ser concluída
  const handleFinishEditing = async () => {
    setIsEditing(false);
    setLoading(true);
    try {
      const data = await CompanyService.getCompany();
      setCompany(data);
    } catch (error) {
      console.error("Failed to refetch company data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setIsEditing(true);

  return (
    <div className="container mx-auto sm:p-4 p-1 space-y-6">
      <PageTitleAdmin
        title="Empresa"
        description="Gerencie os dados da sua empresa e filiais"
      />
      <div className="mt-8">
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : company ? (
          <>
            {isEditing ? (
              <CompanyForm company={company} onFinish={handleFinishEditing} />
            ) : (
              <CompanyDetails company={company} onEdit={handleEdit} />
            )}
            <BranchList branches={company.branches || []} />
          </>
        ) : (
          <CompanySetup />
        )}
      </div>
    </div>
  );
}
