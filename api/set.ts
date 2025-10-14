import { PrismaClient } from "@prisma/client";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { value } = req.body;
    if (typeof value !== "number" || value > 2147483647 || value < -2147483648) {
      return res.status(400).json({ error: "Invalid value" });
    }

    const updated = await prisma.integerValue.upsert({
      where: { id: 1 },
      update: { value, updated_at: new Date() },
      create: { id: 1, value, updated_at: new Date() },
    });

    await prisma.integerHistory.create({
      data: { value, updated_at: new Date() },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update value" });
  } finally {
    await prisma.$disconnect();
  }
}