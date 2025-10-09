# Sistema de Permissões - App For Barber

## Visão Geral

O sistema de permissões foi implementado com uma arquitetura em camadas que garante segurança tanto no frontend quanto no backend.

## Estrutura de Roles

- **SUPER_ADMIN**: Acesso total ao sistema, pode gerenciar múltiplas empresas
- **ADMIN**: Administrador da empresa, pode gerenciar todos os aspectos da sua empresa
- **EMPLOYEE**: Funcionário, acesso limitado às funcionalidades operacionais
- **USER**: Cliente, acesso apenas para agendamentos

## Permissões Disponíveis

### Gestão de Empresa

- `COMPANY_VIEW`: Visualizar dados da empresa
- `COMPANY_EDIT`: Editar dados da empresa
- `COMPANY_DELETE`: Deletar empresa (apenas SUPER_ADMIN)

### Gestão de Filiais

- `BRANCH_VIEW`: Visualizar filiais
- `BRANCH_CREATE`: Criar novas filiais
- `BRANCH_EDIT`: Editar filiais
- `BRANCH_DELETE`: Deletar filiais

### Gestão de Usuários

- `USER_VIEW`: Visualizar usuários
- `USER_CREATE`: Criar novos usuários
- `USER_EDIT`: Editar usuários
- `USER_DELETE`: Deletar usuários

### Gestão de Funcionários

- `EMPLOYEE_VIEW`: Visualizar funcionários
- `EMPLOYEE_CREATE`: Criar novos funcionários
- `EMPLOYEE_EDIT`: Editar funcionários
- `EMPLOYEE_DELETE`: Deletar funcionários

### Serviços

- `SERVICE_VIEW`: Visualizar serviços
- `SERVICE_CREATE`: Criar novos serviços
- `SERVICE_EDIT`: Editar serviços
- `SERVICE_DELETE`: Deletar serviços

### Agendamentos

- `APPOINTMENT_VIEW`: Visualizar agendamentos
- `APPOINTMENT_CREATE`: Criar novos agendamentos
- `APPOINTMENT_EDIT`: Editar agendamentos
- `APPOINTMENT_DELETE`: Deletar agendamentos

### Financeiro

- `FINANCIAL_VIEW`: Visualizar dados financeiros
- `FINANCIAL_EDIT`: Editar dados financeiros
- `CASHIER_OPEN`: Abrir caixa
- `CASHIER_CLOSE`: Fechar caixa

### Relatórios

- `REPORTS_VIEW`: Visualizar relatórios
- `REPORTS_EXPORT`: Exportar relatórios

### Configurações

- `SETTINGS_VIEW`: Visualizar configurações
- `SETTINGS_EDIT`: Editar configurações

## Como Usar

### 1. Hook usePermissions

```typescript
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";

function MyComponent() {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  const canEdit = hasPermission(PERMISSIONS.COMPANY_EDIT);
  const canManageUsers = hasAnyPermission([
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.USER_DELETE,
  ]);

  return (
    <div>
      {canEdit && <button>Editar</button>}
      {canManageUsers && <button>Gerenciar Usuários</button>}
    </div>
  );
}
```

### 2. Componente PermissionGuard

```typescript
import { PermissionGuard } from "@/components/auth";
import { PERMISSIONS } from "@/lib/permissions";

function MyComponent() {
  return (
    <PermissionGuard
      permission={PERMISSIONS.COMPANY_EDIT}
      fallback={<p>Você não tem permissão para editar.</p>}
    >
      <button>Editar Empresa</button>
    </PermissionGuard>
  );
}
```

### 3. Componente RoleGuard

```typescript
import { RoleGuard } from "@/components/auth";
import { Role } from "@/generated/prisma";

function AdminPanel() {
  return (
    <RoleGuard
      roles={[Role.SUPER_ADMIN, Role.ADMIN]}
      fallback={<p>Acesso negado</p>}
    >
      <div>Painel Administrativo</div>
    </RoleGuard>
  );
}
```

### 4. Componente PageGuard

```typescript
import { PageGuard } from "@/components/auth";
import { Role } from "@/generated/prisma";
import { PERMISSIONS } from "@/lib/permissions";

export default function SettingsPage() {
  return (
    <PageGuard
      roles={[Role.SUPER_ADMIN, Role.ADMIN]}
      permissions={[PERMISSIONS.SETTINGS_VIEW]}
      redirectTo="/admin"
    >
      <div>Página de Configurações</div>
    </PageGuard>
  );
}
```

### 5. Botão Protegido

```typescript
import { ProtectedButton } from "@/components/auth";
import { PERMISSIONS } from "@/lib/permissions";

function MyComponent() {
  return (
    <ProtectedButton
      permission={PERMISSIONS.SERVICE_CREATE}
      onClick={() => console.log("Criar serviço")}
    >
      Criar Serviço
    </ProtectedButton>
  );
}
```

### 6. APIs Protegidas

```typescript
// src/app/api/my-route/route.ts
import {
  handleApiError,
  requireRole,
  requireCompanyAccess,
} from "@/lib/auth-utils";
import { Role } from "@/generated/prisma";

export async function POST(req: Request) {
  try {
    // Requer role específica
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    // Ou requer acesso à empresa
    const user = await requireCompanyAccess();

    // Sua lógica aqui...

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Middleware de Proteção

O middleware protege automaticamente as rotas baseado em:

- Autenticação (usuário logado)
- Roles específicas por rota

```typescript
// middleware.ts
const roleBasedRoutes = {
  "/admin/settings": [Role.SUPER_ADMIN, Role.ADMIN],
  "/admin/reports": [Role.SUPER_ADMIN, Role.ADMIN, Role.EMPLOYEE],
};
```

## Boas Práticas

1. **Sempre use verificações duplas**: Frontend para UX + Backend para segurança
2. **Princípio do menor privilégio**: Dê apenas as permissões necessárias
3. **Contexto da empresa**: Sempre verifique se o usuário tem acesso aos dados da empresa
4. **Fallbacks informativos**: Sempre forneça feedback claro quando o acesso é negado
5. **Teste as permissões**: Teste com diferentes roles para garantir que funcionam corretamente

## Adicionando Novas Permissões

1. Adicione a nova permissão em `src/lib/permissions.ts`
2. Atualize o mapeamento `ROLE_PERMISSIONS`
3. Use a nova permissão nos componentes e APIs
4. Atualize esta documentação

## Troubleshooting

### Usuário não consegue acessar uma página

1. Verifique se o usuário tem a role correta
2. Verifique se a permissão está mapeada para a role
3. Verifique se o middleware está configurado corretamente

### API retorna 403

1. Verifique se a API está usando `requireRole` ou `requireCompanyAccess`
2. Verifique se o usuário tem a role necessária
3. Verifique se o usuário pertence à empresa correta
