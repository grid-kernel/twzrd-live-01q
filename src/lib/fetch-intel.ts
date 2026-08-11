import type { HealthPayload, LiveSnapshot } from "./intel-types";

export async function fetchLiveSnapshot(): Promise<LiveSnapshot> {
  const fetchedAt = new Date().toISOString();
  try {
    // Same-origin proxy avoids CORS surprises in embedded preview hosts.
    const res = await fetch("/api/intel-health", {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        ok: false,
        fetchedAt,
        error: `Health returned ${res.status}`,
      };
    }
    const health = (await res.json()) as HealthPayload & { error?: string };
    if (health.error && !health.status) {
      return { ok: false, fetchedAt, error: health.error };
    }
    return { ok: true, fetchedAt, health };
  } catch (err) {
    return {
      ok: false,
      fetchedAt,
      error: err instanceof Error ? err.message : "Failed to reach intel health",
    };
  }
}
