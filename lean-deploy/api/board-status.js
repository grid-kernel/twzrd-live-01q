import { buildBoardSnapshot, compactCfStrategy } from "../lib/board.mjs";
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
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.status(200).send(
      JSON.stringify(
        {
          schema: "twzrd.live_board_status/v1",
          id: board.id,
          version: board.version,
          generated_at: board.generated_at,
          north_star: board.north_star,
          live: board.live,
      cf_strategy: compactCfStrategy(board.cf_strategy),
          next_actions: board.next_actions.map((m) => ({
            id: m.id,
            title: m.title,
            impact: m.impact,
            horizon: m.horizon,
            phase: m.phase,
            metric: m.metric,
          })),
          dogfood: board.dogfood,
          endpoints: board.endpoints,
        },
        null,
        2,
      ),
    );
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "failed" });
  }
}
