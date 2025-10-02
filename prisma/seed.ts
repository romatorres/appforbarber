// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Verifica se já existe uma company padrão
  const existingCompany = await prisma.company.findFirst({
    where: {
      name: "Barbearia Adriano Alves",
    },
  });

  if (!existingCompany) {
    const defaultCompany = await prisma.company.create({
      data: {
        name: "Barbearia Adriano Alves",
        cnpj: "12.345.678/0001-90",
        email: "dev@beautysalon.com",
        phone: "(75) 99999-9999",
        address: "Avenida Getulio Vargas, 123",
        city: "Feira de Santana",
        state: "BA",
        zipCode: "44030-567",
        active: true,
        maxBranches: 1,
        maxEmployees: 5,
        currentBranches: 1,
        currentEmployees: 0,
      },
    });

    console.log("Company padrão criada:", defaultCompany);
  } else {
    console.log("Company padrão já existe:", existingCompany);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
