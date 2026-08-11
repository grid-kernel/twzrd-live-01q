import { createFileRoute } from "@tanstack/react-router";
import {
  buildBoardSnapshot,
  filterMoves,
  jsonResponse,
  parseDoneParam,
  requestOrigin,
} from "@/lib/board-snapshot";

export const Route = createFileRoute("/api/board")({
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

        const phase = url.searchParams.get("phase") ?? undefined;
        const horizon = url.searchParams.get("horizon") ?? undefined;
        const impact = url.searchParams.get("impact") ?? undefined;
        if (phase || horizon || impact) {
          board.moves = filterMoves(board.moves, { phase, horizon, impact });
        }

        return jsonResponse(board);
      },
    },
  },
});
