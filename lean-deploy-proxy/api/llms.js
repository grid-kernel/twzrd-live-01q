import { cors, originFromReq } from "../lib/http.mjs";
import { loadRaw, loadBoardJson } from "../lib/load.mjs";
export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  try {
    // Prefer live board-derived snapshot from github raw llms (has routing + cf)
    let text = await loadRaw("llms.txt");
    // bump generated_at line if present
    const board = await loadBoardJson();
    text = text.replace(/^generated_at:.*$/m, `generated_at: ${board.generated_at}`);
    // ensure host mention
    const origin = originFromReq(req);
    if (!text.includes(origin)) {
      text += `\n\n## This host\n\n- ${origin}/llms.txt\n- ${origin}/api/board\n`;
    }
    res.setHeader("content-type", "text/markdown; charset=utf-8");
    res.status(200).send(text);
  } catch (e) {
    res.status(500).send(String(e));
  }
}
