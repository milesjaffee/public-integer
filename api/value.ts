import { PrismaClient } from "@prisma/client";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const record = await prisma.integerValue.findUnique({
      where: { id: 1 },
    });

    res.status(200).json({ value: record?.value ?? 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch value" });
  } finally {
    await prisma.$disconnect();
  }
}