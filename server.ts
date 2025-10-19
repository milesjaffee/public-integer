
import express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

const app = express();

// Your existing routes
app.get('/', (req, res) => {
  const htmlPath = join(process.cwd(), 'public', 'index.html');
  const html = readFileSync(htmlPath, 'utf-8');
  res.send(html);
});

// Export as Vercel serverless function
export default app;