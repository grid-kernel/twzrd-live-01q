import { createFileRoute } from "@tanstack/react-router";
import { jsonResponse, requestOrigin } from "@/lib/board-snapshot";

export const Route = createFileRoute("/api/openapi.json")({
  server: {
    handlers: {
      OPTIONS: () =>
        new Response(null, {
          status: 204,
          headers: {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET, OPTIONS",
            "access-control-allow-headers": "content-type, accept",
          },
        }),
      GET: ({ request }) => {
        const origin = requestOrigin(request);
        return jsonResponse({
          openapi: "3.1.0",
          info: {
            title: "TWZRD Live 0→1Q",
            version: "1.0.0",
            description:
              "Machine-readable operator board for getting intel.twzrd.xyz from live infra to live demand. Prefer JSON over HTML.",
            contact: { name: "TWZRD", url: "https://twzrd.xyz" },
          },
          servers: [{ url: origin }],
          paths: {
            "/llms.txt": {
              get: {
                summary: "Agent entry guide (markdown)",
                operationId: "getLlmsTxt",
                responses: {
                  "200": {
                    description: "Markdown guide",
                    content: { "text/markdown": { schema: { type: "string" } } },
                  },
                },
              },
            },
            "/api/board": {
              get: {
                summary: "Full board snapshot with live funnel + playbook",
                operationId: "getBoard",
                parameters: [
                  {
                    name: "phase",
                    in: "query",
                    schema: {
                      type: "string",
                      enum: [
                        "truth",
                        "wedge",
                        "proof",
                        "distribution",
                        "convert",
                      ],
                    },
                  },
                  {
                    name: "horizon",
                    in: "query",
                    schema: {
                      type: "string",
                      enum: ["this_week", "this_month", "quarter"],
                    },
                  },
                  {
                    name: "impact",
                    in: "query",
                    schema: {
                      type: "string",
                      enum: ["critical", "high", "medium"],
                    },
                  },
                  {
                    name: "done",
                    in: "query",
                    description: "Comma-separated completed move ids",
                    schema: { type: "string" },
                  },
                ],
                responses: {
                  "200": {
                    description: "Board snapshot",
                    content: {
                      "application/json": {
                        schema: { type: "object" },
                      },
                    },
                  },
                },
              },
            },
            "/api/board/status": {
              get: {
                summary: "Compact live status + next actions",
                operationId: "getBoardStatus",
                responses: {
                  "200": {
                    description: "Status snapshot",
                    content: {
                      "application/json": { schema: { type: "object" } },
                    },
                  },
                },
              },
            },
            "/api/board/moves": {
              get: {
                summary: "Playbook moves only",
                operationId: "getBoardMoves",
                parameters: [
                  { name: "phase", in: "query", schema: { type: "string" } },
                  { name: "horizon", in: "query", schema: { type: "string" } },
                  { name: "impact", in: "query", schema: { type: "string" } },
                  { name: "done", in: "query", schema: { type: "string" } },
                ],
                responses: {
                  "200": {
                    description: "Moves list",
                    content: {
                      "application/json": { schema: { type: "object" } },
                    },
                  },
                },
              },
            },
            "/api/intel-health": {
              get: {
                summary: "Proxy of intel.twzrd.xyz/health",
                operationId: "getIntelHealth",
                responses: {
                  "200": {
                    description: "Upstream health JSON",
                    content: {
                      "application/json": { schema: { type: "object" } },
                    },
                  },
                },
              },
            },
          },
        });
      },
    },
  },
});
