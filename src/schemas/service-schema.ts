import { z } from "zod";

export const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  createdAt: z.string().optional(), // Adicionado para refletir o modelo do DB
});

export type Service = z.infer<typeof serviceSchema>;
export type CreateServiceInput = Omit<Service, "id" | "createdAt">;
