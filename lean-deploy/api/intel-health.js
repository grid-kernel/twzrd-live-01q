import { cors } from "../lib/http.mjs";

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "GET only" });
  try {
    const r = await fetch("https://intel.twzrd.xyz/health", {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    const text = await r.text();
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.status(r.status).send(text);
  } catch (err) {
    res.status(502).json({ error: err instanceof Error ? err.message : "upstream failed" });
  }
}
