# Sistema de Tradução de Roles

## 🎯 **Mapeamento de Roles**

| Role (Inglês) | Tradução (Português) |
| ------------- | -------------------- |
| `SUPER_ADMIN` | Super Administrador  |
| `ADMIN`       | Administrador        |
| `EMPLOYEE`    | Funcionário          |
| `USER`        | Cliente              |

## 🚀 **Como Usar**

### **1. Hook useAuth (Recomendado)**

```tsx
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
  const { user, userRoleTranslated } = useAuth();

  return (
    <div>
      <p>Role original: {user?.role}</p>
      <p>Role traduzida: {userRoleTranslated}</p>
    </div>
  );
}
```

### **2. Função de Tradução Direta**

```tsx
import { translateRole } from "@/lib/role-translations";
import { Role } from "@/generated/prisma";

function MyComponent() {
  return (
    <div>
      <p>{translateRole(Role.EMPLOYEE)}</p> {/* Funcionário */}
      <p>{translateRole(Role.ADMIN)}</p> {/* Administrador */}
    </div>
  );
}
```

### **3. Hook useRoleTranslation**

```tsx
import { useRoleTranslation } from "@/hooks/use-role-translation";

function MyComponent() {
  const { translate, getRoleOptions } = useRoleTranslation();

  return (
    <select>
      {getRoleOptions().map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
```
