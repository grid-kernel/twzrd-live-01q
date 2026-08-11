import { cors } from "../lib/http.mjs";
export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  try {
    const r = await fetch("https://intel.twzrd.xyz/health", {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    const text = await r.text();
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.status(r.status).send(text);
  } catch (e) {
    res.status(502).json({ error: e instanceof Error ? e.message : String(e) });
  }
}
