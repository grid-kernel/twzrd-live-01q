import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
};

export const Route = createFileRoute("/api/intel-health")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: CORS }),
      GET: async () => {
        try {
          const res = await fetch("https://intel.twzrd.xyz/health", {
            headers: { accept: "application/json" },
            cache: "no-store",
          });
          const text = await res.text();
          return new Response(text, {
            status: res.status,
            headers: {
              "content-type": "application/json; charset=utf-8",
              "cache-control": "no-store",
              ...CORS,
            },
          });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Upstream health failed";
          return new Response(JSON.stringify({ error: message }), {
            status: 502,
            headers: {
              "content-type": "application/json; charset=utf-8",
              ...CORS,
            },
          });
        }
      },
    },
  },
});
