import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Get current integer
app.get("/value", async (_, res) => {
  const val = await prisma.integerValue.findUnique({ where: { id: 1 } });
  res.json({ value: val?.value ?? 0 });
});

// Set a new integer
app.post("/set", async (req, res) => {
  const num = Number(req.body.value);
  if (isNaN(num)) return res.status(400).json({ error: "Invalid number" });

  await prisma.integerValue.upsert({
    where: { id: 1 },
    update: { value: num, updated_at: new Date() },
    create: { id: 1, value: num },
  });

  await prisma.integerHistory.create({ data: { value: num } });
  res.json({ ok: true, new_value: num });
});

// Recent history
app.get("/history", async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const history = await prisma.integerHistory.findMany({
    orderBy: { updated_at: "desc" },
    take: limit,
  });
  res.json(history);
});

// Basic stats
app.get("/stats", async (_, res) => {
  const result: any = await prisma.$queryRaw`SELECT AVG(value)::float AS avg FROM "IntegerHistory"`;
  const count = await prisma.integerHistory.count();
  res.json({ average: result[0]?.avg ?? 0, count });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));