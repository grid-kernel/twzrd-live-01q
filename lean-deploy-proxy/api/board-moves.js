import { cors } from "../lib/http.mjs";
import { loadBoardJson } from "../lib/load.mjs";
export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  try {
    const board = await loadBoardJson();
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.status(200).send(JSON.stringify({
      schema: "twzrd.live_board_moves/v1",
      id: board.id,
      version: board.version,
      generated_at: board.generated_at,
      count: (board.moves || []).length,
      phases: board.phases,
      moves: board.moves,
    }, null, 2));
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
}
