import { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
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
            const val = await fetch("/value").then(r => r.json());
            document.getElementById("value").textContent = val.value;

            const hist = await fetch("/history?limit=5").then(r => r.json());
            document.getElementById("history").innerHTML = hist
              .map(h => {<li>h.value <small>(new Date(h.updated_at).toLocaleString())</small></li>})
              .join("");
          }

          document.getElementById("setBtn").onclick = async () => {
            const v = Number(document.getElementById("newVal").value);
            if (!Number.isFinite(v)) return alert("Enter a valid number!");
            await fetch("/set", {
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