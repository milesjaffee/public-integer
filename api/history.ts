import { PrismaClient } from "@prisma/client";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const limit = Number(req.query.limit);
  try {
    const history = await prisma.integerHistory.findMany({
      orderBy: { updated_at: "desc" },
      //take: limit,
    });
    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
}