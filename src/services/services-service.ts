import { ServiceData, CreateServiceData } from "@/schemas/service-schema";
import { apiClient } from "@/lib/api-client";

export const ServicesService = {
  async getAll(): Promise<ServiceData[]> {
    return apiClient("/api/services");
  },
  async create(data: CreateServiceData): Promise<ServiceData> {
    return apiClient("/api/services", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async update(id: string, data: Partial<ServiceData>): Promise<ServiceData> {
    return apiClient(`/api/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async delete(id: string): Promise<void> {
    await apiClient(`/api/services/${id}`, { method: "DELETE" });
  },
};
