import { z } from "zod";
import { BranchSchema } from "./branch-schema";

export const CompanySchema = z.object({
  name: z
    .string()
    .min(1, "Nome da empresa é obrigatório")
    .max(100, "Nome muito longo (máx. 100 caracteres)")
    .trim(),
  cnpj: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(val), {
      message: "CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX",
    }),
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
  logo: z.string().url("URL do logo inválida").optional().or(z.literal("")),
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
  maxBranches: z.number().int().min(-1).default(0),
  maxEmployees: z.number().int().min(-1).default(2),
  currentBranches: z.number().int().min(0).default(0),
  currentEmployees: z.number().int().min(0).default(0),
  branches: z.array(BranchSchema).optional(),
});

// Para criação - campos obrigatórios apenas
export const CreateCompanySchema = CompanySchema.pick({
  name: true,
  cnpj: true,
  email: true,
  phone: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
});

// Para atualização - todos os campos opcionais
export const UpdateCompanySchema = CompanySchema.partial();

// Tipos
export type CompanyData = z.infer<typeof CompanySchema> & { id: string };
export type CreateCompanyData = z.infer<typeof CreateCompanySchema>;
export type UpdateCompanyData = z.infer<typeof UpdateCompanySchema>;
