import { create } from "zustand";
import { ProfessionalService } from "@/services/professional-service";
import {
  ProfessionalData,
  CreateProfessionalData,
} from "@/schemas/professional-schema";
import { toast } from "sonner";

interface ProfessionalStore {
  professionals: ProfessionalData[];
  loading: boolean;
  error: string | null;
  selectedProfessional: ProfessionalData | null;
  setProfessionals: (professionals: ProfessionalData[]) => void;
  loadProfessionals: () => Promise<void>;
  createProfessionals: (data: CreateProfessionalData) => Promise<void>;
  updateProfessionals: (
    id: string,
    data: Partial<ProfessionalData>
  ) => Promise<void>;
  deleteProfessional: (id: string) => Promise<void>;
  selectProfessional: (professional: ProfessionalData | null) => void;
}

export const useProfessionalStore = create<ProfessionalStore>((set) => ({
  professionals: [],
  loading: false,
  error: null,
  selectedProfessional: null,

  setProfessionals: (professionals) =>
    set({ professionals, loading: false, error: null }),

  selectProfessional: (professional) =>
    set({ selectedProfessional: professional }),

  loadProfessionals: async () => {
    set({ loading: true, error: null });
    try {
      const data = await ProfessionalService.getAll();
      set({ professionals: data, loading: false });
    } catch {
      const errorMessage = "Erro ao carregar profissionais";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  createProfessionals: async (data) => {
    try {
      const newProfessional = await ProfessionalService.create(data);
      set((state) => ({
        professionals: [...state.professionals, newProfessional],
        error: null,
      }));
      toast.success("Profissional criado com sucesso");
    } catch {
      const errorMessage = "Erro ao criar o profissional";
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },

  updateProfessionals: async (id, data) => {
    try {
      const updated = await ProfessionalService.update(id, data);
      set((state) => ({
        professionals: state.professionals.map((i) =>
          i.id === id ? updated : i
        ),
        selectedProfessional: null,
        error: null,
      }));
      toast.success("Profissional atualizado");
    } catch {
      const errorMessage = "Erro ao atualizar o profissional";
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },

  deleteProfessional: async (id) => {
    try {
      await ProfessionalService.delete(id);
      set((state) => ({
        professionals: state.professionals.filter((i) => i.id !== id),
        error: null,
      }));
      toast.success("Profissional removido");
    } catch {
      const errorMessage = "Erro ao deletar o profissional";
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },
}));