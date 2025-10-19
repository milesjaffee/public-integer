import { VercelRequest, VercelResponse } from "@vercel/node";
import {promises} from "fs";
import {join} from "path";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const filePath = join(process.cwd(), "public", "index.html");

  try {
    const html = await promises.readFile(filePath, "utf8");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (err) {
    res.status(500).send("Error loading page.");
  }
}