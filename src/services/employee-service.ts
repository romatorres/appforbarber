import {
  EmployeeData,
  CreateEmployeeData,
  UpdateEmployeeData,
  InviteEmployeeData,
  EmployeeWithUser,
  // Aliases para compatibilidade
  ProfessionalData,
  CreateProfessionalData,
} from "@/schemas/employee-schema";
import { apiClient } from "@/lib/api-client";

export const EmployeeService = {
  /**
   * Buscar todos os funcionários da empresa do usuário logado
   */
  async getAll(): Promise<EmployeeWithUser[]> {
    return apiClient("/api/employees");
  },

  /**
   * Buscar funcionário por ID (com verificação de empresa)
   */
  async getById(id: string): Promise<EmployeeWithUser> {
    return apiClient(`/api/employees/${id}`);
  },

  /**
   * Criar funcionário simples (sem acesso ao sistema)
   */
  async create(data: CreateEmployeeData): Promise<EmployeeData> {
    return apiClient("/api/employees", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Criar funcionário com convite para acesso ao sistema
   */
  async createWithInvite(data: InviteEmployeeData): Promise<EmployeeData> {
    return apiClient("/api/employees/invite", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Alias para createWithInvite (compatibilidade com store)
   */
  async invite(data: InviteEmployeeData): Promise<EmployeeData> {
    return this.createWithInvite(data);
  },

  /**
   * Atualizar funcionário
   */
  async update(id: string, data: UpdateEmployeeData): Promise<EmployeeData> {
    return apiClient(`/api/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },



  /**
   * Reenviar convite para funcionário
   */
  async resendInvite(id: string): Promise<void> {
    return apiClient(`/api/employees/${id}/resend-invite`, {
      method: "POST",
    });
  },

  /**
   * Remover funcionário (soft delete)
   */
  async delete(id: string): Promise<void> {
    return apiClient(`/api/employees/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Buscar funcionários por filial
   */
  async getByBranch(branchId: string): Promise<EmployeeWithUser[]> {
    return apiClient(`/api/employees?branchId=${branchId}`);
  },

  /**
   * Buscar funcionários disponíveis para um serviço
   */
  async getAvailableForService(serviceId: string): Promise<EmployeeWithUser[]> {
    return apiClient(`/api/employees/available-for-service/${serviceId}`);
  },
};

// Alias para compatibilidade (manter por enquanto)
export const ProfessionalService = {
  getAll: () => EmployeeService.getAll(),
  create: (data: CreateProfessionalData) => EmployeeService.create(data),
  update: (id: string, data: Partial<ProfessionalData>) => EmployeeService.update(id, data),
  delete: (id: string) => EmployeeService.delete(id),
};
