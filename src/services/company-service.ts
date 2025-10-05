import { CompanyData, CreateCompanyData, UpdateCompanyData } from "@/schemas/company-schema";
import { apiClient } from "@/lib/api-client";

export const CompanyService = {
  async getCurrent(): Promise<CompanyData> {
    return apiClient("/api/company/current");
  },

  async getCompany(): Promise<CompanyData> {
    return apiClient("/api/company");
  },

  async create(data: CreateCompanyData): Promise<CompanyData> {
    return apiClient("/api/company", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: UpdateCompanyData): Promise<CompanyData> {
    return apiClient(`/api/company/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient(`/api/company/${id}`, { method: "DELETE" });
  },
};
