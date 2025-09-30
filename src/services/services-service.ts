import { Service, CreateServiceInput } from "@/schemas/service-schema";
import { apiClient } from "@/lib/api-client";

export const ServicesService = {
  async getAll(): Promise<Service[]> {
    return apiClient("/api/services");
  },
  async create(data: CreateServiceInput): Promise<Service> {
    return apiClient("/api/services", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async update(id: string, data: Partial<Service>): Promise<Service> {
    return apiClient(`/api/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async delete(id: string): Promise<void> {
    await apiClient(`/api/services/${id}`, { method: "DELETE" });
  },
};
