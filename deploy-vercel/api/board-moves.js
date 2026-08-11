import { buildBoardSnapshot, filterMoves } from "../lib/board.mjs";
import { cors, originFromReq, parseDone, query } from "../lib/http.mjs";

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "GET only" });
  try {
    const board = await buildBoardSnapshot({
      doneIds: parseDone(req),
      origin: originFromReq(req),
    });
    const moves = filterMoves(board.moves, query(req));
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.status(200).send(
      JSON.stringify(
        {
          schema: "twzrd.live_board_moves/v1",
          id: board.id,
          version: board.version,
          generated_at: board.generated_at,
          count: moves.length,
          phases: board.phases,
          moves,
        },
        null,
        2,
      ),
    );
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "failed" });
  }
}
