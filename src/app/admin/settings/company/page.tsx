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
import { PageGuard, PermissionGuard } from "@/components/auth";
import { PERMISSIONS } from "@/lib/permissions";
import { Role } from "@/generated/prisma";

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
    <PageGuard
      roles={[Role.SUPER_ADMIN, Role.ADMIN]}
      fallback={
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      }
    >
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
              <PermissionGuard permission={PERMISSIONS.COMPANY_VIEW}>
                {isEditing ? (
                  <PermissionGuard
                    permission={PERMISSIONS.COMPANY_EDIT}
                    fallback={
                      <div className="p-4 border rounded-lg">
                        <p className="text-muted-foreground">
                          Você não tem permissão para editar os dados da
                          empresa.
                        </p>
                      </div>
                    }
                  >
                    <CompanyForm
                      company={company}
                      onFinish={handleFinishEditing}
                    />
                  </PermissionGuard>
                ) : (
                  <CompanyDetails company={company} onEdit={handleEdit} />
                )}
              </PermissionGuard>

              <PermissionGuard permission={PERMISSIONS.BRANCH_VIEW}>
                <BranchList branches={company.branches || []} />
              </PermissionGuard>
            </>
          ) : (
            <PermissionGuard
              permission={PERMISSIONS.COMPANY_EDIT}
              fallback={
                <div className="p-4 border rounded-lg">
                  <p className="text-muted-foreground">
                    Você não tem permissão para configurar a empresa.
                  </p>
                </div>
              }
            >
              <CompanySetup />
            </PermissionGuard>
          )}
        </div>
      </div>
    </PageGuard>
  );
}
