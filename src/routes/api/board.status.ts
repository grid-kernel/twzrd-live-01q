import { createFileRoute } from "@tanstack/react-router";
import {
  buildBoardSnapshot,
  jsonResponse,
  parseDoneParam,
  requestOrigin,
} from "@/lib/board-snapshot";

export const Route = createFileRoute("/api/board/status")({
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
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const doneIds = parseDoneParam(url.searchParams.get("done"));
        const board = await buildBoardSnapshot({
          doneIds,
          origin: requestOrigin(request),
        });

        return jsonResponse({
          schema: "twzrd.live_board_status/v1",
          id: board.id,
          version: board.version,
          generated_at: board.generated_at,
          north_star: board.north_star,
          live: board.live,
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
        });
      },
    },
  },
});
