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