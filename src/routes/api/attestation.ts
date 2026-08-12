import { createFileRoute } from "@tanstack/react-router";
import { jsonResponse, requestOrigin } from "@/lib/board-snapshot";
import { buildAttestationPack } from "@/lib/attestation";

export const Route = createFileRoute("/api/attestation")({
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
        const pack = buildAttestationPack({
          origin: requestOrigin(request),
        });
        return jsonResponse(pack);
      },
    },
  },
});
