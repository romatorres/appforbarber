import { create } from "zustand";
import { CompanyService } from "@/services/company-service";
import { CompanyData, CreateCompanyData } from "@/schemas/company-schema";
import { toast } from "sonner";

interface CompanyStore {
  company: CompanyData[];
  loading: boolean;
  error: string | null;
  selectedCompany: CompanyData | null;
  setCompany: (company: CompanyData[]) => void; // Add this line
  loadCompany: () => Promise<void>;
  createCompany: (data: CreateCompanyData) => Promise<void>;
  updateCompany: (id: string, data: Partial<CompanyData>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  selectCompany: (company: CompanyData | null) => void;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  company: [],
  loading: false,
  error: null,
  selectedCompany: null,

  setCompany: (company) => set({ company, loading: false, error: null }), // Add this line

  selectCompany: (company) => set({ selectedCompany: company }),

  loadCompany: async () => {
    set({ loading: true, error: null });
    try {
      const data = await CompanyService.getAll();
      set({ company: data, loading: false });
    } catch {
      const errorMessage = "Erro ao carregar a empresa";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  createCompany: async (data) => {
    try {
      const newCompany = await CompanyService.create(data);
      set((state) => ({
        company: [...state.company, newCompany],
        error: null,
      }));
      toast.success("Empresa criada com sucesso");
    } catch {
      const errorMessage = "Erro ao criar a empresa";
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },

  updateCompany: async (id, data) => {
    try {
      const updated = await CompanyService.update(id, data);
      set((state) => ({
        company: state.company.map((i) => (i.id === id ? updated : i)),
        selectedCompany: null,
        error: null,
      }));
      toast.success("Empresa atualizada");
    } catch {
      const errorMessage = "Erro ao atualizar a empresa";
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },

  deleteCompany: async (id) => {
    try {
      await CompanyService.delete(id);
      set((state) => ({
        company: state.company.filter((i) => i.id !== id),
        error: null,
      }));
      toast.success("Empresa removida");
    } catch {
      const errorMessage = "Erro ao deletar a empresa";
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },
}));
