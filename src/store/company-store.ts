import { create } from "zustand";
import { CompanyService } from "@/services/company-service";
import { CompanyData, CreateCompanyData, UpdateCompanyData } from "@/schemas/company-schema";
import { toast } from "sonner";

interface CompanyStore {
  company: CompanyData | null;
  loading: boolean;
  error: string | null;

  // Actions
  setCompany: (company: CompanyData | null) => void;
  loadCompany: () => Promise<void>;
  createCompany: (data: CreateCompanyData) => Promise<CompanyData | null>;
  updateCompany: (id: string, data: UpdateCompanyData) => Promise<CompanyData | null>;
  deleteCompany: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  company: null,
  loading: false,
  error: null,

  setCompany: (company) => set({ company, error: null }),

  clearError: () => set({ error: null }),

  loadCompany: async () => {
    set({ loading: true, error: null });
    try {
      const data = await CompanyService.getCurrent();
      set({ company: data, loading: false });
    } catch (error) {
      const errorMessage = "Erro ao carregar dados da empresa";
      set({ error: errorMessage, loading: false, company: null });
      toast.error(errorMessage);
    }
  },

  createCompany: async (data) => {
    set({ loading: true, error: null });
    try {
      const newCompany = await CompanyService.create(data);
      set({
        company: newCompany,
        loading: false,
        error: null
      });
      toast.success("Empresa criada com sucesso!");
      return newCompany;
    } catch (error) {
      const errorMessage = "Erro ao criar empresa";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updateCompany: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedCompany = await CompanyService.update(id, data);
      set({
        company: updatedCompany,
        loading: false,
        error: null
      });
      toast.success("Empresa atualizada com sucesso!");
      return updatedCompany;
    } catch (error) {
      const errorMessage = "Erro ao atualizar empresa";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  deleteCompany: async (id) => {
    set({ loading: true, error: null });
    try {
      await CompanyService.delete(id);
      set({
        company: null,
        loading: false,
        error: null
      });
      toast.success("Empresa removida com sucesso!");
    } catch (error) {
      const errorMessage = "Erro ao deletar empresa";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },
}));