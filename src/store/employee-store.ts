import { create } from "zustand";
import { EmployeeService } from "@/services/employee-service";
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
import { toast } from "sonner";

interface EmployeeStore {
  employees: EmployeeWithUser[];
  loading: boolean;
  error: string | null;
  selectedEmployee: EmployeeWithUser | null;

  // Actions
  setEmployees: (employees: EmployeeWithUser[]) => void;
  loadEmployees: () => Promise<void>;
  createEmployee: (data: CreateEmployeeData) => Promise<EmployeeData | null>;
  inviteEmployee: (data: InviteEmployeeData) => Promise<EmployeeData | null>;
  updateEmployee: (id: string, data: UpdateEmployeeData) => Promise<EmployeeData | null>;
  deleteEmployee: (id: string) => Promise<void>;
  toggleSystemAccess: (id: string, hasAccess: boolean) => Promise<void>;
  selectEmployee: (employee: EmployeeWithUser | null) => void;
  clearError: () => void;

  // Aliases para compatibilidade (manter por enquanto)
  professionals: EmployeeWithUser[];
  selectedProfessional: EmployeeWithUser | null;
  setProfessionals: (professionals: EmployeeWithUser[]) => void;
  loadProfessionals: () => Promise<void>;
  createProfessionals: (data: CreateProfessionalData) => Promise<void>;
  updateProfessionals: (id: string, data: Partial<ProfessionalData>) => Promise<void>;
  deleteProfessional: (id: string) => Promise<void>;
  selectProfessional: (professional: EmployeeWithUser | null) => void;
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  loading: false,
  error: null,
  selectedEmployee: null,

  // Getters para compatibilidade
  get professionals() { return get().employees; },
  get selectedProfessional() { return get().selectedEmployee; },

  setEmployees: (employees) =>
    set({ employees, loading: false, error: null }),

  selectEmployee: (employee) =>
    set({ selectedEmployee: employee }),

  clearError: () =>
    set({ error: null }),

  loadEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const data = await EmployeeService.getAll();
      // Converter para EmployeeWithUser se necessário
      const employees: EmployeeWithUser[] = data.map(emp => ({
        ...emp,
        user: emp.userId ? {
          id: emp.userId,
          name: emp.name,
          email: emp.email,
          role: "EMPLOYEE",
          emailVerified: false,
        } : null,
      }));
      set({ employees, loading: false });
    } catch (error) {
      const errorMessage = "Erro ao carregar funcionários";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  createEmployee: async (data) => {
    set({ loading: true, error: null });
    try {
      const newEmployee = await EmployeeService.create(data);

      const employeeWithUser: EmployeeWithUser = {
        ...newEmployee,
        user: null,
      };

      set((state) => ({
        employees: [...state.employees, employeeWithUser],
        loading: false,
        error: null,
      }));

      toast.success("Funcionário cadastrado com sucesso!");
      return newEmployee;
    } catch (error) {
      const errorMessage = "Erro ao cadastrar funcionário";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  inviteEmployee: async (data) => {
    set({ loading: true, error: null });
    try {
      // Usar API específica de convite
      const result = await EmployeeService.invite(data);

      const employeeWithUser: EmployeeWithUser = {
        ...result,
        user: result.userId ? {
          id: result.userId,
          name: result.name,
          email: result.email,
          role: "EMPLOYEE",
          emailVerified: false,
        } : null,
      };

      set((state) => ({
        employees: [...state.employees, employeeWithUser],
        loading: false,
        error: null,
      }));

      // Usar mensagem personalizada da API se disponível
      const successMessage = result.message || "Funcionário criado e convite enviado por email!";
      toast.success(successMessage);
      return result;
    } catch (error: any) {
      // Tentar extrair mensagem amigável do erro
      let errorMessage = "Erro ao criar funcionário e enviar convite";

      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }

      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updateEmployee: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedEmployee = await EmployeeService.update(id, data);

      set((state) => ({
        employees: state.employees.map((emp) =>
          emp.id === id ? { ...emp, ...updatedEmployee } : emp
        ),
        selectedEmployee: null,
        loading: false,
        error: null,
      }));

      toast.success("Funcionário atualizado com sucesso!");
      return updatedEmployee;
    } catch (error) {
      const errorMessage = "Erro ao atualizar funcionário";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  toggleSystemAccess: async (id, hasAccess) => {
    // Por enquanto, usar update normal até implementar API específica
    await get().updateEmployee(id, { hasSystemAccess: hasAccess });
  },

  deleteEmployee: async (id) => {
    set({ loading: true, error: null });
    try {
      await EmployeeService.delete(id);

      set((state) => ({
        employees: state.employees.filter((emp) => emp.id !== id),
        selectedEmployee: null,
        loading: false,
        error: null,
      }));

      toast.success("Funcionário removido com sucesso!");
    } catch (error) {
      const errorMessage = "Erro ao remover funcionário";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  // Aliases para compatibilidade
  setProfessionals: (professionals) => get().setEmployees(professionals),
  loadProfessionals: () => get().loadEmployees(),
  createProfessionals: async (data) => {
    await get().createEmployee(data);
  },
  updateProfessionals: async (id, data) => {
    await get().updateEmployee(id, data);
  },
  deleteProfessional: (id) => get().deleteEmployee(id),
  selectProfessional: (professional) => get().selectEmployee(professional),
}));

// Alias para compatibilidade
export const useProfessionalStore = useEmployeeStore;