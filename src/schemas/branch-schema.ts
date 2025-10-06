import { z } from "zod";

export const BranchSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "Nome da filial é obrigatório")
    .max(100, "Nome muito longo (máx. 100 caracteres)"),
  code: z.string().min(1, "Código é obrigatório"),
  email: z
    .string()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(val), {
      message: "Telefone deve estar no formato (XX) XXXXX-XXXX",
    }),
  address: z.string().max(200, "Endereço muito longo").optional().or(z.literal("")),
  city: z.string().max(100, "Cidade muito longa").optional().or(z.literal("")),
  state: z.string().max(2, "Estado deve ter 2 caracteres").optional().or(z.literal("")),
  zipCode: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{5}-?\d{3}$/.test(val), {
      message: "CEP deve estar no formato XXXXX-XXX",
    }),
  active: z.boolean().default(true),
  companyId: z.string(),
});

export const CreateBranchSchema = BranchSchema.omit({ id: true, companyId: true });
export const UpdateBranchSchema = CreateBranchSchema.partial();

export type BranchData = z.infer<typeof BranchSchema>;
export type CreateBranchData = z.infer<typeof CreateBranchSchema>;
export type UpdateBranchData = z.infer<typeof UpdateBranchSchema>;
