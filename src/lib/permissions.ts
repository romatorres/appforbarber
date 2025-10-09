import { Role } from "@/generated/prisma";

export const PERMISSIONS = {
  // Gestão de Empresa
  COMPANY_VIEW: "company:view",
  COMPANY_EDIT: "company:edit",
  COMPANY_DELETE: "company:delete",

  // Gestão de Filiais
  BRANCH_VIEW: "branch:view",
  BRANCH_CREATE: "branch:create",
  BRANCH_EDIT: "branch:edit",
  BRANCH_DELETE: "branch:delete",

  // Gestão de Usuários
  USER_VIEW: "user:view",
  USER_CREATE: "user:create",
  USER_EDIT: "user:edit",
  USER_DELETE: "user:delete",

  // Gestão de Funcionários
  EMPLOYEE_VIEW: "employee:view",
  EMPLOYEE_CREATE: "employee:create",
  EMPLOYEE_EDIT: "employee:edit",
  EMPLOYEE_DELETE: "employee:delete",

  // Serviços
  SERVICE_VIEW: "service:view",
  SERVICE_CREATE: "service:create",
  SERVICE_EDIT: "service:edit",
  SERVICE_DELETE: "service:delete",

  // Agendamentos
  APPOINTMENT_VIEW: "appointment:view",
  APPOINTMENT_CREATE: "appointment:create",
  APPOINTMENT_EDIT: "appointment:edit",
  APPOINTMENT_DELETE: "appointment:delete",

  // Financeiro
  FINANCIAL_VIEW: "financial:view",
  FINANCIAL_EDIT: "financial:edit",
  CASHIER_OPEN: "cashier:open",
  CASHIER_CLOSE: "cashier:close",

  // Relatórios
  REPORTS_VIEW: "reports:view",
  REPORTS_EXPORT: "reports:export",

  // Configurações
  SETTINGS_VIEW: "settings:view",
  SETTINGS_EDIT: "settings:edit",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [Role.ADMIN]: [
    PERMISSIONS.COMPANY_VIEW,
    PERMISSIONS.COMPANY_EDIT,
    PERMISSIONS.BRANCH_VIEW,
    PERMISSIONS.BRANCH_CREATE,
    PERMISSIONS.BRANCH_EDIT,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.EMPLOYEE_VIEW,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_EDIT,
    PERMISSIONS.SERVICE_VIEW,
    PERMISSIONS.SERVICE_CREATE,
    PERMISSIONS.SERVICE_EDIT,
    PERMISSIONS.APPOINTMENT_VIEW,
    PERMISSIONS.APPOINTMENT_CREATE,
    PERMISSIONS.APPOINTMENT_EDIT,
    PERMISSIONS.FINANCIAL_VIEW,
    PERMISSIONS.FINANCIAL_EDIT,
    PERMISSIONS.CASHIER_OPEN,
    PERMISSIONS.CASHIER_CLOSE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
  ],
  [Role.EMPLOYEE]: [
    PERMISSIONS.APPOINTMENT_VIEW,
    PERMISSIONS.APPOINTMENT_CREATE,
    PERMISSIONS.APPOINTMENT_EDIT,
    PERMISSIONS.SERVICE_VIEW,
    PERMISSIONS.FINANCIAL_VIEW,
    PERMISSIONS.REPORTS_VIEW,
  ],
  [Role.USER]: [PERMISSIONS.APPOINTMENT_VIEW, PERMISSIONS.APPOINTMENT_CREATE],
};
