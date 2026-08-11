import { cors, originFromReq } from "../lib/http.mjs";
import { loadBoardJson, compactCf } from "../lib/load.mjs";
export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  try {
    const board = await loadBoardJson();
    const origin = originFromReq(req);
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.status(200).send(JSON.stringify({
      schema: "twzrd.live_board_status/v1",
      id: board.id,
      version: board.version,
      generated_at: board.generated_at,
      north_star: board.north_star,
      live: board.live,
      cf_strategy: compactCf(board.cf_strategy),
      next_actions: (board.next_actions || []).map((m) => ({
        id: m.id, title: m.title, impact: m.impact, horizon: m.horizon, phase: m.phase, metric: m.metric,
      })),
      dogfood: board.dogfood,
      endpoints: {
        ...(board.endpoints || {}),
        human_ui: `${origin}/`,
        llms_txt: `${origin}/llms.txt`,
        board_json: `${origin}/api/board`,
      },
    }, null, 2));
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
}
