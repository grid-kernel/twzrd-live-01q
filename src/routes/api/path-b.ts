import { createFileRoute } from "@tanstack/react-router";
import {
  jsonResponse,
  requestOrigin,
  textResponse,
} from "@/lib/board-snapshot";
import {
  buildPathBRunbook,
  pathBToMarkdown,
} from "@/lib/path-b-runbook";

export const Route = createFileRoute("/api/path-b")({
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
        const origin = requestOrigin(request);
        const rb = buildPathBRunbook({ origin });
        const format = (url.searchParams.get("format") ?? "json").toLowerCase();
        if (format === "md" || format === "markdown" || format === "txt") {
          return textResponse(pathBToMarkdown(rb), "text/markdown; charset=utf-8");
        }
        return jsonResponse(rb);
      },
    },
  },
});
