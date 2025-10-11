import { z } from "zod";

// Enum para status do funcionário
export const EmployeeStatusEnum = z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE"]);

// Schema base do funcionário (mantendo compatibilidade com Professional)
export const EmployeeSchema = z.object({
  // IDs de relacionamento
  companyId: z.string().cuid("ID da empresa inválido"),
  branchId: z.string().cuid("ID da filial inválido").optional(),
  userId: z.string().cuid("ID de usuário inválido").optional(),

  // Dados pessoais
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome muito longo (máx. 100 caracteres)")
    .trim(),
  email: z
    .string()
    .email("Email inválido")
    .min(1, "Email é obrigatório")
    .trim(),
  phoneNumber: z
    .string()
    .max(20, "Telefone muito longo")
    .optional(),

  // Dados profissionais
  commissionRate: z
    .number()
    .min(0, "Comissão não pode ser negativa")
    .max(100, "Comissão não pode ser maior que 100%")
    .default(50.0),
  specialties: z.string().optional(),
  bio: z
    .string()
    .max(1000, "Biografia muito longa (máx. 1000 caracteres)")
    .optional(),

  // Controle de acesso
  hasSystemAccess: z.boolean().default(false),

  // Status e datas
  status: EmployeeStatusEnum.default("ACTIVE"),
  startDate: z.coerce.date().default(() => new Date()),
});

// Schema para criação (admin não informa companyId - será herdado)
export const CreateEmployeeSchema = EmployeeSchema.omit({
  companyId: true,
  userId: true,
});

// Schema para atualização
export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();

// Schema para convite (quando funcionário terá acesso ao sistema)
export const InviteEmployeeSchema = CreateEmployeeSchema.extend({
  sendInvite: z.boolean().default(false),
  temporaryPassword: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .optional(),
});

// Tipos TypeScript
export type EmployeeData = z.infer<typeof EmployeeSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateEmployeeData = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployeeData = z.infer<typeof UpdateEmployeeSchema>;
export type InviteEmployeeData = z.infer<typeof InviteEmployeeSchema>;

// Tipo para funcionário com dados do usuário (quando aplicável)
export type EmployeeWithUser = EmployeeData & {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
  } | null;
};

// Aliases para compatibilidade (manter por enquanto)
export const ProfessionalSchema = EmployeeSchema;
export const CreateProfessionalSchema = CreateEmployeeSchema;
export const UpdateProfessionalSchema = UpdateEmployeeSchema;
export type ProfessionalData = EmployeeData;
export type CreateProfessionalData = CreateEmployeeData;
export type UpdateProfessionalData = UpdateEmployeeData;
