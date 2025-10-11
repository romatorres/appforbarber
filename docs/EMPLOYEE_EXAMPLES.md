# 💡 Exemplos Práticos - Sistema de Funcionários

## 🎯 Casos de Uso Reais

### **Cenário 1: Barbearia Pequena (2 funcionários)**

**Situação:** João tem uma barbearia e quer cadastrar seus 2 barbeiros.

**Fluxo:**
1. João (ADMIN) acessa `/admin/employees`
2. Cadastra "Carlos Silva" - apenas dados básicos
3. Cadastra "Pedro Santos" - com acesso ao sistema para agendamentos
4. Carlos não pode fazer login, Pedro pode

**Código de exemplo:**
```typescript
// Cadastro do Carlos (sem acesso)
const carlosData = {
  name: "Carlos Silva",
  email: "carlos@barbearia.com",
  phoneNumber: "(11) 99999-1111",
  commissionRate: 60,
  specialties: "Corte masculino, Barba",
  hasSystemAccess: false
};

// Cadastro do Pedro (com acesso)
const pedroData = {
  name: "Pedro Santos", 
  email: "pedro@barbearia.com",
  sendInvite: true,
  commissionRate: 55,
  specialties: "Corte, Coloração"
};
```

---

### **Cenário 2: Salão de Beleza (5 funcionários)**

**Situação:** Maria tem um salão e quer organizar sua equipe por especialidades.

**Funcionários:**
- **Ana** (Gerente) - Acesso total ao sistema
- **Carla** (Cabeleireira) - Acesso para agendamentos
- **Júlia** (Manicure) - Apenas registro
- **Roberto** (Recepcionista) - Acesso limitado
- **Fernanda** (Esteticista) - Acesso para agendamentos

**Interface esperada:**
```
👥 Funcionários (5/10)

┌─────────────────────────────────────────┐
│ 👤 Ana Costa                    🛡️ ATIVO │
│ 📧 ana@salao.com                        │
│ 📱 (11) 99999-2222                      │
│ 💰 Comissão: 70% | Gerente             │
│ ⚙️ [Editar] [Remover Acesso] [Excluir]  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 👤 Carla Mendes                  ATIVO  │
│ 📧 carla@salao.com                      │
│ 📱 (11) 99999-3333                      │
│ 💰 Comissão: 60% | Corte, Coloração    │
│ ⚙️ [Editar] [Conceder Acesso] [Excluir] │
└─────────────────────────────────────────┘
```

---

### **Cenário 3: Rede de Salões (Múltiplas Filiais)**

**Situação:** Empresa com matriz + 3 filiais, cada uma com funcionários específicos.

**Estrutura:**
```
🏢 Beleza Total (Matriz)
├── 🏪 Filial Shopping (branchId: branch_001)
│   ├── Maria (Gerente)
│   ├── João (Barbeiro)
│   └── Ana (Recepcionista)
├── 🏪 Filial Centro (branchId: branch_002)
│   ├── Carlos (Gerente)
│   └── Lucia (Cabeleireira)
└── 🏪 Filial Bairro (branchId: branch_003)
    ├── Pedro (Barbeiro)
    └── Julia (Manicure)
```

**Cadastro com filial:**
```typescript
const funcionarioFilial = {
  name: "Maria Santos",
  email: "maria@belezatotal.com",
  branchId: "branch_001", // Filial Shopping
  commissionRate: 65,
  specialties: "Gestão, Atendimento"
};
```

---

## 🔧 Exemplos de Código

### **1. Hook Personalizado para Funcionários**

```typescript
// hooks/useEmployeeActions.ts
export function useEmployeeActions() {
  const { 
    createEmployee, 
    updateEmployee, 
    toggleSystemAccess,
    deleteEmployee 
  } = useEmployeeStore();

  const handleCreateWithInvite = async (data: CreateEmployeeData) => {
    try {
      const employee = await createEmployee(data);
      if (employee && data.hasSystemAccess) {
        await toggleSystemAccess(employee.id, true);
        toast.success("Funcionário criado e convite enviado!");
      }
      return employee;
    } catch (error) {
      toast.error("Erro ao criar funcionário");
      return null;
    }
  };

  const handlePromoteToManager = async (employeeId: string) => {
    try {
      await updateEmployee(employeeId, { 
        commissionRate: 70,
        specialties: "Gestão, Supervisão" 
      });
      await toggleSystemAccess(employeeId, true);
      toast.success("Funcionário promovido a gerente!");
    } catch (error) {
      toast.error("Erro na promoção");
    }
  };

  return {
    handleCreateWithInvite,
    handlePromoteToManager
  };
}
```

### **2. Componente de Estatísticas**

```typescript
// components/EmployeeStats.tsx
export function EmployeeStats() {
  const { employees } = useEmployeeStore();

  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'ACTIVE').length;
    const withAccess = employees.filter(e => e.hasSystemAccess).length;
    const avgCommission = employees.reduce((acc, e) => acc + e.commissionRate, 0) / total;

    return { total, active, withAccess, avgCommission };
  }, [employees]);

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-500">Ativos</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.withAccess}</div>
          <div className="text-sm text-gray-500">Com Acesso</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{stats.avgCommission.toFixed(1)}%</div>
          <div className="text-sm text-gray-500">Comissão Média</div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### **3. Filtros Avançados**

```typescript
// components/EmployeeFilters.tsx
export function EmployeeFilters() {
  const { employees, setEmployees } = useEmployeeStore();
  const [filters, setFilters] = useState({
    status: 'all',
    hasAccess: 'all',
    specialty: ''
  });

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      if (filters.status !== 'all' && employee.status !== filters.status) {
        return false;
      }
      
      if (filters.hasAccess !== 'all') {
        const hasAccess = filters.hasAccess === 'true';
        if (employee.hasSystemAccess !== hasAccess) {
          return false;
        }
      }
      
      if (filters.specialty && !employee.specialties?.toLowerCase().includes(filters.specialty.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [employees, filters]);

  return (
    <div className="flex gap-4 mb-4">
      <Select value={filters.status} onValueChange={(value) => 
        setFilters(prev => ({ ...prev, status: value }))
      }>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="ACTIVE">Ativos</SelectItem>
          <SelectItem value="INACTIVE">Inativos</SelectItem>
          <SelectItem value="ON_LEAVE">Afastados</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.hasAccess} onValueChange={(value) => 
        setFilters(prev => ({ ...prev, hasAccess: value }))
      }>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Acesso" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="true">Com Acesso</SelectItem>
          <SelectItem value="false">Sem Acesso</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Filtrar por especialidade..."
        value={filters.specialty}
        onChange={(e) => setFilters(prev => ({ ...prev, specialty: e.target.value }))}
        className="w-60"
      />
    </div>
  );
}
```

---

## 🎨 Exemplos de Interface

### **1. Card de Funcionário Expandido**

```typescript
// components/EmployeeCard.tsx
export function EmployeeCard({ employee }: { employee: EmployeeWithUser }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        {/* Header sempre visível */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{employee.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                {employee.name}
                {employee.hasSystemAccess && <Shield className="h-4 w-4 text-green-600" />}
              </h3>
              <p className="text-sm text-gray-500">{employee.email}</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>

        {/* Detalhes expandíveis */}
        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Telefone:</span>
                <p>{employee.phoneNumber || 'Não informado'}</p>
              </div>
              <div>
                <span className="text-gray-500">Comissão:</span>
                <p>{employee.commissionRate}%</p>
              </div>
              <div>
                <span className="text-gray-500">Especialidades:</span>
                <p>{employee.specialties || 'Não informado'}</p>
              </div>
              <div>
                <span className="text-gray-500">Data de Início:</span>
                <p>{format(new Date(employee.startDate), 'dd/MM/yyyy')}</p>
              </div>
            </div>
            
            {employee.bio && (
              <div>
                <span className="text-gray-500 text-sm">Biografia:</span>
                <p className="text-sm mt-1">{employee.bio}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### **2. Modal de Confirmação Personalizado**

```typescript
// components/EmployeeDeleteModal.tsx
export function EmployeeDeleteModal({ 
  employee, 
  open, 
  onClose, 
  onConfirm 
}: {
  employee: EmployeeWithUser | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!employee) return null;

  const hasActiveAppointments = true; // Verificar se tem agendamentos

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Confirmar Exclusão
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p>
            Tem certeza que deseja excluir o funcionário{' '}
            <span className="font-semibold">{employee.name}</span>?
          </p>
          
          {hasActiveAppointments && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Atenção</span>
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                Este funcionário possui agendamentos ativos. 
                A exclusão não afetará os agendamentos existentes.
              </p>
            </div>
          )}
          
          <div className="bg-gray-50 rounded p-3">
            <h4 className="font-medium text-sm mb-2">O que acontecerá:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Funcionário será marcado como inativo</li>
              <li>• Acesso ao sistema será removido</li>
              <li>• Histórico será preservado</li>
              <li>• Agendamentos existentes não serão afetados</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirmar Exclusão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 📊 Exemplos de Relatórios

### **1. Relatório de Comissões**

```typescript
// utils/employeeReports.ts
export function generateCommissionReport(employees: EmployeeWithUser[]) {
  const report = employees.map(employee => ({
    name: employee.name,
    commissionRate: employee.commissionRate,
    // Calcular com base nos agendamentos (futuro)
    totalServices: 0,
    totalRevenue: 0,
    totalCommission: 0,
    status: employee.status
  }));

  const summary = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'ACTIVE').length,
    averageCommission: employees.reduce((acc, e) => acc + e.commissionRate, 0) / employees.length,
    totalCommissionPaid: report.reduce((acc, r) => acc + r.totalCommission, 0)
  };

  return { report, summary };
}
```

### **2. Exportação para CSV**

```typescript
// utils/employeeExport.ts
export function exportEmployeesToCSV(employees: EmployeeWithUser[]) {
  const headers = [
    'Nome',
    'Email', 
    'Telefone',
    'Comissão (%)',
    'Especialidades',
    'Status',
    'Acesso Sistema',
    'Data Início'
  ];

  const rows = employees.map(employee => [
    employee.name,
    employee.email,
    employee.phoneNumber || '',
    employee.commissionRate.toString(),
    employee.specialties || '',
    employee.status,
    employee.hasSystemAccess ? 'Sim' : 'Não',
    format(new Date(employee.startDate), 'dd/MM/yyyy')
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `funcionarios_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
}
```

---

## 🔧 Configurações Avançadas

### **1. Middleware de Validação**

```typescript
// middleware/employeeValidation.ts
export async function validateEmployeeOperation(
  operation: 'create' | 'update' | 'delete',
  employeeData: any,
  userId: string
) {
  const user = await getCurrentUser(userId);
  
  // Verificar permissões
  if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
    throw new Error('Sem permissão para gerenciar funcionários');
  }

  // Verificar limites da empresa
  if (operation === 'create') {
    const { canAdd } = await EmployeeSecurity.canAddMoreEmployees(user.companyId);
    if (!canAdd) {
      throw new Error('Limite de funcionários atingido');
    }
  }

  // Verificar email único
  if (operation === 'create' || (operation === 'update' && employeeData.email)) {
    const emailAvailable = await EmployeeSecurity.isEmailAvailableInCompany(
      employeeData.email,
      user.companyId,
      operation === 'update' ? employeeData.id : undefined
    );
    
    if (!emailAvailable) {
      throw new Error('Email já está em uso');
    }
  }

  return true;
}
```

### **2. Cache e Performance**

```typescript
// hooks/useEmployeeCache.ts
export function useEmployeeCache() {
  const queryClient = useQueryClient();

  const employees = useQuery({
    queryKey: ['employees'],
    queryFn: () => EmployeeService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });

  const invalidateEmployees = () => {
    queryClient.invalidateQueries(['employees']);
  };

  const updateEmployeeCache = (updatedEmployee: EmployeeWithUser) => {
    queryClient.setQueryData(['employees'], (old: EmployeeWithUser[] | undefined) => {
      if (!old) return [updatedEmployee];
      return old.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp);
    });
  };

  return {
    employees: employees.data || [],
    loading: employees.isLoading,
    error: employees.error,
    invalidateEmployees,
    updateEmployeeCache
  };
}
```

---

## 🎯 Casos de Teste

### **1. Teste de Segurança**

```typescript
// __tests__/employee-security.test.ts
describe('Employee Security', () => {
  test('should isolate employees by company', async () => {
    const company1 = await createTestCompany();
    const company2 = await createTestCompany();
    
    const employee1 = await createTestEmployee({ companyId: company1.id });
    const employee2 = await createTestEmployee({ companyId: company2.id });
    
    // Admin da empresa 1 não deve ver funcionário da empresa 2
    const admin1 = await createTestUser({ companyId: company1.id, role: 'ADMIN' });
    
    const response = await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${admin1.token}`);
    
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toBe(employee1.id);
  });

  test('should respect employee limits', async () => {
    const company = await createTestCompany({ maxEmployees: 2 });
    
    // Criar 2 funcionários (limite)
    await createTestEmployee({ companyId: company.id });
    await createTestEmployee({ companyId: company.id });
    
    // Tentar criar o 3º deve falhar
    const admin = await createTestUser({ companyId: company.id, role: 'ADMIN' });
    
    const response = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({
        name: 'Terceiro Funcionário',
        email: 'terceiro@empresa.com'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Limite de funcionários atingido');
  });
});
```

### **2. Teste de Interface**

```typescript
// __tests__/employee-form.test.tsx
describe('Employee Form', () => {
  test('should validate required fields', async () => {
    render(<EmployeeForm />);
    
    const submitButton = screen.getByText('Criar Funcionário');
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
  });

  test('should show invite section when checkbox is checked', async () => {
    render(<EmployeeForm />);
    
    const checkbox = screen.getByLabelText('Conceder acesso ao sistema');
    fireEvent.click(checkbox);
    
    expect(screen.getByText('Convite por Email')).toBeInTheDocument();
  });
});
```

---

*Exemplos práticos gerados em: 11/10/2024*  
*Para uso com o Sistema de Funcionários v1.0.0*