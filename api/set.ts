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

// Set a new integer
app.post("/set", async (req, res) => {
  const num = Number(req.body.value);
  if (isNaN(num) || num > 2147483647 || num < -2147483648) return res.status(400).json({ error: "Invalid number" });

  await prisma.integerValue.upsert({
    where: { id: 1 },
    update: { value: num, updated_at: new Date() },
    create: { id: 1, value: num },
  });

  await prisma.integerHistory.create({ data: { value: num } });
  res.json({ ok: true, new_value: num });
});