import { cors, originFromReq } from "../lib/http.mjs";

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  const origin = originFromReq(req);
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.status(200).send(
    JSON.stringify(
      {
        openapi: "3.1.0",
        info: {
          title: "TWZRD Live 0→1Q",
          version: "1.1.0",
          description:
            "Machine-readable operator board for intel 0→1Q. Includes Path B playbook, live day0, and folded CF strategy (SPRAT) at board.cf_strategy. Pay decisions → intel preflight, not this API.",
        },
        servers: [{ url: origin }],
        paths: {
          "/llms.txt": { get: { summary: "Agent markdown guide", operationId: "getLlmsTxt" } },
          "/api/board": {
            get: {
              summary: "Full board + cf_strategy",
              operationId: "getBoard",
              description: "Includes cf_strategy (twzrd.cf_strategy/v1) from SPRAT fold.",
            },
          },
          "/api/board/status": {
            get: {
              summary: "Live status + next actions + cf_strategy summary",
              operationId: "getStatus",
            },
          },
          "/api/board/moves": { get: { summary: "Playbook moves", operationId: "getMoves" } },
          "/api/intel-health": { get: { summary: "Proxy intel health", operationId: "getHealth" } },
          "/api/openapi.json": { get: { summary: "This document", operationId: "getOpenApi" } },
        },
      },
      null,
      2,
    ),
  );
}
