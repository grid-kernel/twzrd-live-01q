import { cors, originFromReq } from "../lib/http.mjs";
export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  const origin = originFromReq(req);
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.status(200).send(JSON.stringify({
    openapi: "3.1.0",
    info: {
      title: "TWZRD Live 0→1Q",
      version: "1.1.0",
      description: "Machine-readable operator board. Includes cf_strategy (SPRAT fold). Pay decisions → intel preflight.",
    },
    servers: [{ url: origin }],
    paths: {
      "/llms.txt": { get: { summary: "Agent guide", operationId: "getLlmsTxt" } },
      "/api/board": { get: { summary: "Full board + cf_strategy", operationId: "getBoard" } },
      "/api/board/status": { get: { summary: "Status + cf summary", operationId: "getStatus" } },
      "/api/board/moves": { get: { summary: "Moves", operationId: "getMoves" } },
      "/api/intel-health": { get: { summary: "Intel health proxy", operationId: "getHealth" } },
      "/api/openapi.json": { get: { summary: "OpenAPI", operationId: "getOpenApi" } },
    },
  }, null, 2));
}
