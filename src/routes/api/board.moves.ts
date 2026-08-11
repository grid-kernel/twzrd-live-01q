import { createFileRoute } from "@tanstack/react-router";
import {
  buildBoardSnapshot,
  filterMoves,
  jsonResponse,
  parseDoneParam,
  requestOrigin,
} from "@/lib/board-snapshot";

export const Route = createFileRoute("/api/board/moves")({
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
        const moves = filterMoves(board.moves, {
          phase: url.searchParams.get("phase") ?? undefined,
          horizon: url.searchParams.get("horizon") ?? undefined,
          impact: url.searchParams.get("impact") ?? undefined,
        });

        return jsonResponse({
          schema: "twzrd.live_board_moves/v1",
          id: board.id,
          version: board.version,
          generated_at: board.generated_at,
          count: moves.length,
          phases: board.phases,
          moves,
        });
      },
    },
  },
});
