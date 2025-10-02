-- CreateTable
CREATE TABLE "public"."company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "logo" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "maxBranches" INTEGER NOT NULL DEFAULT 0,
    "maxEmployees" INTEGER NOT NULL DEFAULT 2,
    "currentBranches" INTEGER NOT NULL DEFAULT 0,
    "currentEmployees" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscription" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "maxBranches" INTEGER NOT NULL,
    "maxEmployees" INTEGER NOT NULL,
    "pricePerMonth" DOUBLE PRECISION NOT NULL,
    "billingCycle" TEXT NOT NULL DEFAULT 'MONTHLY',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."branch" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "managerId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employee" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "branchId" TEXT,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "specialties" TEXT,
    "bio" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."service" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."appointment" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "branchId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."commission" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employeeId" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,

    CONSTRAINT "commission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."work_schedule" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isWorking" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "work_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."service_history" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "rating" INTEGER,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment_method" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."voucher" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment" (
    "id" TEXT NOT NULL,
    "voucherId" TEXT,
    "type" TEXT NOT NULL DEFAULT 'INCOME',
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "paymentMethodId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paidAt" TIMESTAMP(3),
    "cashierClosingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bill" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "categoryId" TEXT NOT NULL,
    "supplier" TEXT,
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bill_category" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bill_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cashier_closing" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "branchId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "openingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "closingBalance" DOUBLE PRECISION NOT NULL,
    "totalIncome" DOUBLE PRECISION NOT NULL,
    "totalExpenses" DOUBLE PRECISION NOT NULL,
    "totalCommissions" DOUBLE PRECISION NOT NULL,
    "observations" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "closedBy" TEXT NOT NULL,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "cashier_closing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."specialty" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_EmployeeToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EmployeeToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_EmployeeToSpecialty" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EmployeeToSpecialty_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_cnpj_key" ON "public"."company"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_companyId_key" ON "public"."subscription"("companyId");

-- CreateIndex
CREATE INDEX "subscription_companyId_idx" ON "public"."subscription"("companyId");

-- CreateIndex
CREATE INDEX "branch_companyId_idx" ON "public"."branch"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "branch_companyId_code_key" ON "public"."branch"("companyId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE INDEX "user_companyId_idx" ON "public"."user"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "employee_userId_key" ON "public"."employee"("userId");

-- CreateIndex
CREATE INDEX "employee_companyId_idx" ON "public"."employee"("companyId");

-- CreateIndex
CREATE INDEX "employee_branchId_idx" ON "public"."employee"("branchId");

-- CreateIndex
CREATE INDEX "service_companyId_idx" ON "public"."service"("companyId");

-- CreateIndex
CREATE INDEX "service_active_idx" ON "public"."service"("active");

-- CreateIndex
CREATE INDEX "appointment_companyId_idx" ON "public"."appointment"("companyId");

-- CreateIndex
CREATE INDEX "appointment_branchId_idx" ON "public"."appointment"("branchId");

-- CreateIndex
CREATE INDEX "appointment_employeeId_idx" ON "public"."appointment"("employeeId");

-- CreateIndex
CREATE INDEX "appointment_date_idx" ON "public"."appointment"("date");

-- CreateIndex
CREATE INDEX "appointment_status_idx" ON "public"."appointment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "commission_appointmentId_key" ON "public"."commission"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "work_schedule_employeeId_dayOfWeek_key" ON "public"."work_schedule"("employeeId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "service_history_appointmentId_key" ON "public"."service_history"("appointmentId");

-- CreateIndex
CREATE INDEX "service_history_employeeId_idx" ON "public"."service_history"("employeeId");

-- CreateIndex
CREATE INDEX "service_history_date_idx" ON "public"."service_history"("date");

-- CreateIndex
CREATE INDEX "payment_method_companyId_idx" ON "public"."payment_method"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "voucher_appointmentId_key" ON "public"."voucher"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "voucher_code_key" ON "public"."voucher"("code");

-- CreateIndex
CREATE UNIQUE INDEX "payment_voucherId_key" ON "public"."payment"("voucherId");

-- CreateIndex
CREATE INDEX "payment_cashierClosingId_idx" ON "public"."payment"("cashierClosingId");

-- CreateIndex
CREATE INDEX "payment_type_idx" ON "public"."payment"("type");

-- CreateIndex
CREATE UNIQUE INDEX "bill_paymentId_key" ON "public"."bill"("paymentId");

-- CreateIndex
CREATE INDEX "bill_companyId_idx" ON "public"."bill"("companyId");

-- CreateIndex
CREATE INDEX "bill_dueDate_idx" ON "public"."bill"("dueDate");

-- CreateIndex
CREATE INDEX "bill_status_idx" ON "public"."bill"("status");

-- CreateIndex
CREATE INDEX "bill_category_companyId_idx" ON "public"."bill_category"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "bill_category_companyId_name_key" ON "public"."bill_category"("companyId", "name");

-- CreateIndex
CREATE INDEX "cashier_closing_companyId_idx" ON "public"."cashier_closing"("companyId");

-- CreateIndex
CREATE INDEX "cashier_closing_branchId_idx" ON "public"."cashier_closing"("branchId");

-- CreateIndex
CREATE INDEX "cashier_closing_date_idx" ON "public"."cashier_closing"("date");

-- CreateIndex
CREATE UNIQUE INDEX "cashier_closing_companyId_branchId_date_key" ON "public"."cashier_closing"("companyId", "branchId", "date");

-- CreateIndex
CREATE INDEX "specialty_companyId_idx" ON "public"."specialty"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "specialty_companyId_name_key" ON "public"."specialty"("companyId", "name");

-- CreateIndex
CREATE INDEX "_EmployeeToService_B_index" ON "public"."_EmployeeToService"("B");

-- CreateIndex
CREATE INDEX "_EmployeeToSpecialty_B_index" ON "public"."_EmployeeToSpecialty"("B");

-- AddForeignKey
ALTER TABLE "public"."subscription" ADD CONSTRAINT "subscription_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."branch" ADD CONSTRAINT "branch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."service" ADD CONSTRAINT "service_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."appointment" ADD CONSTRAINT "appointment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."appointment" ADD CONSTRAINT "appointment_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."appointment" ADD CONSTRAINT "appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."appointment" ADD CONSTRAINT "appointment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."appointment" ADD CONSTRAINT "appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."commission" ADD CONSTRAINT "commission_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."commission" ADD CONSTRAINT "commission_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."work_schedule" ADD CONSTRAINT "work_schedule_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."service_history" ADD CONSTRAINT "service_history_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."service_history" ADD CONSTRAINT "service_history_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."service_history" ADD CONSTRAINT "service_history_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment_method" ADD CONSTRAINT "payment_method_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."voucher" ADD CONSTRAINT "voucher_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "public"."voucher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "public"."payment_method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_cashierClosingId_fkey" FOREIGN KEY ("cashierClosingId") REFERENCES "public"."cashier_closing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bill" ADD CONSTRAINT "bill_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bill" ADD CONSTRAINT "bill_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."bill_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bill" ADD CONSTRAINT "bill_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bill_category" ADD CONSTRAINT "bill_category_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cashier_closing" ADD CONSTRAINT "cashier_closing_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cashier_closing" ADD CONSTRAINT "cashier_closing_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cashier_closing" ADD CONSTRAINT "cashier_closing_closedBy_fkey" FOREIGN KEY ("closedBy") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."specialty" ADD CONSTRAINT "specialty_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EmployeeToService" ADD CONSTRAINT "_EmployeeToService_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EmployeeToService" ADD CONSTRAINT "_EmployeeToService_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EmployeeToSpecialty" ADD CONSTRAINT "_EmployeeToSpecialty_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EmployeeToSpecialty" ADD CONSTRAINT "_EmployeeToSpecialty_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."specialty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
