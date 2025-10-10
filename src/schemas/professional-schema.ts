// schemas/professional-schema.ts
import { z } from "zod";

const ProfessionalStatusEnum = z
  .enum(["ACTIVE", "INACTIVE", "ON_LEAVE"])
  .default("ACTIVE");

export const ProfessionalSchema = z.object({
  companyId: z.string().cuid("ID da empresa inválido"),
  branchId: z.string().cuid("ID da filial inválido").nullish(),
  userId: z.string().cuid("ID de usuário inválido").nullish(),
  name: z
    .string()
    .min(1, "Nome do profissional é obrigatório")
    .max(100, "Nome muito longo (máx. 100 caracteres)")
    .trim(),
  email: z
    .string()
    .email("Endereço de e-mail inválido")
    .min(1, "E-mail é obrigatório")
    .trim(),
  phoneNumber: z.string().max(20, "Número de telefone muito longo").nullish(),
  commissionRate: z
    .number()
    .min(0, "A comissão não pode ser menor que 0%")
    .max(100, "A comissão não pode ser maior que 100%")
    .default(50.0),
  specialties: z.string().nullish(),

  bio: z
    .string()
    .max(1000, "Biografia muito longa (máx. 1000 caracteres)")
    .nullish(),

  startDate: z.coerce.date(),
  status: ProfessionalStatusEnum,
});

// Para criação - sem companyId no frontend
export const CreateProfessionalSchema = ProfessionalSchema.omit({
  companyId: true,
});

// Para atualização - todos os campos opcionais
export const UpdateProfessionalSchema = CreateProfessionalSchema.partial();

// Tipos
export type ProfessionalData = z.infer<typeof ProfessionalSchema> & {
  id: string;
};
export type CreateProfessionalData = z.infer<typeof CreateProfessionalSchema>;
export type UpdateProfessionalData = z.infer<typeof UpdateProfessionalSchema>;
