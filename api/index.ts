import { VercelRequest, VercelResponse } from '@vercel/node'
import fs from 'fs'
import path from 'path'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.url === '/favicon.ico') {
    const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico')
    const favicon = fs.readFileSync(faviconPath)
    res.setHeader('Content-Type', 'image/x-icon')
    return res.status(200).send(favicon)
  }

  res.setHeader('Content-Type', 'text/html')
  res.status(200).send(`
    <html>
      <head>
        <title>Publicly Chosen Integer</title>
        <style>
          body {
            font-family: system-ui, sans-serif;
            text-align: center;
            padding: 2rem;
          }
          input, button {
            font-size: 1rem;
            padding: 0.5rem;
          }
          ul { list-style: none; padding: 0; }
        </style>
        <link rel="icon" href="/public/favicon.ico" />
      </head>
      <body>
        <h1>🌐 public integer</h1>
        <p>Current value: <strong id="value">...</strong></p>
        <input id="newVal" type="number" placeholder="Enter new number">
        <button id="setBtn">Set</button>

        <h3>Recent history</h3>
        <ul id="history"></ul>

        <script>
          async function refresh() {
            const val = await fetch("/api/value").then(r => r.json());
            document.getElementById("value").textContent = val.value;

            const hist = await fetch("/api/history?limit=5").then(r => r.json());
            document.getElementById("history").innerHTML = hist
              .map(h => {<li>h.value <small>(new Date(h.updated_at).toLocaleString())</small></li>})
              .join("");
          }

          document.getElementById("setBtn").onclick = async () => {
            const v = Number(document.getElementById("newVal").value);
            if (!Number.isFinite(v)) return alert("Enter a valid number!");
            await fetch("/api/set", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ value: v })
            });
            refresh();
          };

          refresh();
        </script>
      </body>
    </html>
  `)
}