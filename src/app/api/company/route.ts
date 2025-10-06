import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const company = await prisma.company.findFirst({
    include: {
      branches: true,
    },
  });
  return NextResponse.json(company);
}

export async function POST(req: Request) {
  const data = await req.json();
  const company = await prisma.company.create({ data });
  return NextResponse.json(company);
}
