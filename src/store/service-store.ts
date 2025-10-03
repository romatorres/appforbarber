import { create } from "zustand";
import { ServicesService } from "@/services/services-service";
import { ServiceData, CreateServiceData } from "@/schemas/service-schema";
import { toast } from "sonner";

interface ServiceStore {
  services: ServiceData[];
  loading: boolean;
  error: string | null;
  selectedService: ServiceData | null;
  setServices: (services: ServiceData[]) => void; // Add this line
  loadServices: () => Promise<void>;
  createServices: (data: CreateServiceData) => Promise<void>;
  updateServices: (id: string, data: Partial<ServiceData>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  selectService: (service: ServiceData | null) => void;
}

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  loading: false,
  error: null,
  selectedService: null,

  setServices: (services) => set({ services, loading: false, error: null }), // Add this line

  selectService: (service) => set({ selectedService: service }),

  loadServices: async () => {
    set({ loading: true, error: null });
    try {
      const data = await ServicesService.getAll();
      set({ services: data, loading: false });
    } catch {
      const errorMessage = "Erro ao carregar serviços";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  createServices: async (data) => {
    try {
      const newService = await ServicesService.create(data);
      set((state) => ({
        services: [...state.services, newService],
        error: null,
      }));
      toast.success("Serviço criado com sucesso");
    } catch {
      const errorMessage = "Erro ao criar o serviço";
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },

  updateServices: async (id, data) => {
    try {
      const updated = await ServicesService.update(id, data);
      set((state) => ({
        services: state.services.map((i) => (i.id === id ? updated : i)),
        selectedService: null,
        error: null,
      }));
      toast.success("Serviço atualizado");
    } catch {
      const errorMessage = "Erro ao atualizar o serviço";
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },

  deleteService: async (id) => {
    try {
      await ServicesService.delete(id);
      set((state) => ({
        services: state.services.filter((i) => i.id !== id),
        error: null,
      }));
      toast.success("Serviço removido");
    } catch {
      const errorMessage = "Erro ao deletar o seviço";
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },
}));
