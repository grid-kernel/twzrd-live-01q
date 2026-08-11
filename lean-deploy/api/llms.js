import { buildBoardSnapshot, boardToLlmsTxt } from "../lib/board.mjs";
import { cors, originFromReq, parseDone } from "../lib/http.mjs";

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "GET only" });
  try {
    const board = await buildBoardSnapshot({
      doneIds: parseDone(req),
      origin: originFromReq(req),
    });
    res.setHeader("content-type", "text/markdown; charset=utf-8");
    res.status(200).send(boardToLlmsTxt(board));
  } catch (err) {
    res.status(500).send(String(err));
  }
}
