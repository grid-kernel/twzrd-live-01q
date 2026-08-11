import { cors, originFromReq } from "../lib/http.mjs";
import { loadBoardJson } from "../lib/load.mjs";
export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  try {
    const board = await loadBoardJson();
    const origin = originFromReq(req);
    board.product = { ...board.product, human_ui: `${origin}/`, machine_start: `${origin}/llms.txt` };
    board.endpoints = {
      ...(board.endpoints || {}),
      human_ui: `${origin}/`,
      llms_txt: `${origin}/llms.txt`,
      board_json: `${origin}/api/board`,
      status_json: `${origin}/api/board/status`,
      moves_json: `${origin}/api/board/moves`,
      openapi: `${origin}/api/openapi.json`,
      intel_health_proxy: `${origin}/api/intel-health`,
    };
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.status(200).send(JSON.stringify(board, null, 2));
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
}
