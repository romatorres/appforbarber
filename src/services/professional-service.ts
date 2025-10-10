import {
  ProfessionalData,
  CreateProfessionalData,
} from "@/schemas/professional-schema";
import { apiClient } from "@/lib/api-client";

export const ProfessionalService = {
  async getAll(): Promise<ProfessionalData[]> {
    return apiClient("/api/professionals");
  },
  async create(data: CreateProfessionalData): Promise<ProfessionalData> {
    return apiClient("/api/professionals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async update(
    id: string,
    data: Partial<ProfessionalData>
  ): Promise<ProfessionalData> {
    return apiClient(`/api/professionals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async delete(id: string): Promise<void> {
    await apiClient(`/api/professionals/${id}`, { method: "DELETE" });
  },
};
