import { ServiceData, CreateServiceData } from "@/schemas/service-schema";
import { apiClient } from "@/lib/api-client";

export const CompanyService = {
  async getAll(): Promise<ServiceData[]> {
    return apiClient("/api/company");
  },
  async create(data: CreateServiceData): Promise<ServiceData> {
    return apiClient("/api/company", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async update(id: string, data: Partial<ServiceData>): Promise<ServiceData> {
    return apiClient(`/api/company/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async delete(id: string): Promise<void> {
    await apiClient(`/api/company/${id}`, { method: "DELETE" });
  },
};
