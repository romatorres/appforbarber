// schemas/service-schema.ts
import { z } from "zod";

export const ServiceSchema = z.object({
  companyId: z.string().cuid("ID da empresa inválido"),
  name: z
    .string()
    .min(1, "Nome do serviço é obrigatório")
    .max(100, "Nome muito longo (máx. 100 caracteres)")
    .trim(),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(500, "Descrição muito longa (máx. 500 caracteres)")
    .trim(),
  duration: z
    .number()
    .int("Duração deve ser um número inteiro")
    .min(5, "Duração mínima é 5 minutos")
    .max(480, "Duração máxima é 480 minutos (8 horas)"),
  price: z
    .number()
    .min(0, "Preço não pode ser negativo")
    .max(99999.99, "Preço muito alto")
    .refine((val) => val === 0 || val >= 0.01, {
      message: "Preço deve ser zero ou maior que R$ 0,01",
    }),
  active: z.boolean().default(true), // Mantém como opcional com default
});

// Para criação - sem companyId no frontend
export const CreateServiceSchema = ServiceSchema.omit({ companyId: true });

// Para atualização - todos os campos opcionais
export const UpdateServiceSchema = CreateServiceSchema.partial();

// Tipos
export type ServiceData = z.infer<typeof ServiceSchema>;
export type CreateServiceData = z.infer<typeof CreateServiceSchema>;
export type UpdateServiceData = z.infer<typeof UpdateServiceSchema>;
