import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PathBRunbookPanel } from "@/components/live/path-b-runbook-panel";
import { buildPathBRunbook } from "@/lib/path-b-runbook";
import { useMemo } from "react";

export const Route = createFileRoute("/path-b")({
  component: PathBPage,
  head: () => ({
    meta: [
      { title: "Path B Runbook — TWZRD Live 0→1Q" },
      {
        name: "description",
        content:
          "Screen-share-ready Path B external integration runbook: refuse-before-sign install, BLOCK/ALLOW evidence, Vicky→Nick→Lucas sequence.",
      },
    ],
  }),
});

function PathBPage() {
  const rb = useMemo(
    () =>
      buildPathBRunbook({
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
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Live Board
            </Link>
            <p className="mt-0.5 truncate text-sm font-semibold tracking-tight text-fg">
              Path B · External integration runbook
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href="/api/path-b"
              className="rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-[11px] text-muted hover:text-fg"
            >
              /api/path-b
            </a>
            <span className="hidden rounded-lg border border-brand/30 bg-brand/10 px-2.5 py-1.5 text-[11px] font-medium text-fg sm:inline">
              Screen-share mode
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 overflow-x-hidden px-4 py-5 sm:px-6 sm:py-8">
        <div className="rounded-xl border border-border bg-surface-2/40 px-4 py-3 text-sm text-muted">
          <span className="font-medium text-fg">North star: </span>
          {rb.north_star}
        </div>
        <PathBRunbookPanel compact={false} runbook={rb} />
        <footer className="pb-10 pt-2 text-center text-xs text-subtle">
          Agents: prefer{" "}
          <a href="/api/path-b" className="text-muted hover:text-fg">
            /api/path-b
          </a>{" "}
          · board{" "}
          <a href="/api/board" className="text-muted hover:text-fg">
            /api/board
          </a>
        </footer>
      </main>
    </div>
  );
}
