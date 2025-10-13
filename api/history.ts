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

// Recent history
app.get("/history", async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const history = await prisma.integerHistory.findMany({
    orderBy: { updated_at: "desc" },
    take: limit,
  });
  res.json(history);
});