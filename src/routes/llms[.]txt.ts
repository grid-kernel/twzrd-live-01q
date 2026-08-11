import { createFileRoute } from "@tanstack/react-router";
import {
  boardToLlmsTxt,
  buildBoardSnapshot,
  parseDoneParam,
  requestOrigin,
  textResponse,
} from "@/lib/board-snapshot";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const doneIds = parseDoneParam(url.searchParams.get("done"));
        const board = await buildBoardSnapshot({
          doneIds,
          origin: requestOrigin(request),
        });
        return textResponse(boardToLlmsTxt(board), "text/markdown; charset=utf-8");
      },
    },
  },
});
