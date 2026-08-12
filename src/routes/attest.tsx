import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { AttestationPanel } from "@/components/live/attestation-panel";
import { buildAttestationPack } from "@/lib/attestation";

export const Route = createFileRoute("/attest")({
  component: AttestPage,
  head: () => ({
    meta: [
      { title: "Agent Attestation — TWZRD" },
      {
        name: "description",
        content:
          "Schultz-shaped agent attestation demo: who an agent represents, scope, freshness, allow/warn/block — plus real intel preflight curl.",
      },
    ],
  }),
});

function AttestPage() {
  const pack = useMemo(
    () =>
      buildAttestationPack({
        origin:
          typeof window !== "undefined" ? window.location.origin : undefined,
      }),
    [],
  );

  return (
    <div className="min-h-dvh overflow-x-hidden bg-bg">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-fg"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Live Board
            </Link>
            <p className="mt-0.5 truncate text-sm font-semibold tracking-tight">
              Agent attestation · plug-in demo
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link
              to="/path-b"
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[11px] text-muted hover:text-fg"
            >
              Path B
            </Link>
            <a
              href="/api/attestation"
              className="rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-[11px] text-muted hover:text-fg"
            >
              /api/attestation
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 overflow-x-hidden px-4 py-5 sm:px-6 sm:py-8">
        <div className="rounded-xl border border-border bg-surface-2/40 px-4 py-3 text-sm text-muted">
          <span className="font-medium text-fg">Product claim: </span>
          External verification edge for agentic commerce — not another agent
          runtime, not agent-social. Path B enforces refuse-before-sign; free
          preflight is advisory until the gate is installed.
        </div>
        <AttestationPanel compact={false} pack={pack} />
        <section className="panel p-5 sm:p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
            Narrative angles (for X / partners)
          </p>
          <ul className="mt-3 space-y-2">
            {pack.narrative_angles.map((a) => (
              <li
                key={a.angle}
                className="rounded-xl border border-border bg-bg px-3 py-2.5"
              >
                <p className="text-sm font-medium text-fg">{a.angle}</p>
                <p className="mt-0.5 text-xs text-muted">{a.hook}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
