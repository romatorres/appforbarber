import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const companys = await prisma.company.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(companys);
}

export async function POST(req: Request) {
  const data = await req.json();
  const company = await prisma.company.create({ data });
  return NextResponse.json(company);
}
