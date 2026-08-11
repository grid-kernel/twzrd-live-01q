import { Activity, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LiveSnapshot } from "@/lib/intel-types";
import { cn } from "@/lib/cn";

type Props = {
  snapshot: LiveSnapshot | null;
  loading: boolean;
  onRefresh: () => void;
  scorePct: number;
};

export function PulseHeader({ snapshot, loading, onRefresh, scorePct }: Props) {
  const health = snapshot?.health;
  const live = snapshot?.ok && health?.status === "ok";

  return (
    <header className="border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-2">
            <Activity className="h-4 w-4 text-brand" aria-hidden />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
                Live 0→1Q
              </h1>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
                  live
                    ? "border-ok/30 bg-ok/10 text-ok"
                    : "border-warn/30 bg-warn/10 text-warn",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    live ? "bg-ok" : "bg-warn",
                  )}
                />
                {live ? "Intel live" : "Pulse degraded"}
              </span>
            </div>
            <p className="mt-0.5 max-w-xl text-sm text-muted">
              Operator board for{" "}
              <a
                href="https://intel.twzrd.xyz"
                target="_blank"
                rel="noreferrer"
                className="text-fg underline-offset-4 hover:underline"
              >
                intel.twzrd.xyz
              </a>
              {" — "}figure out real demand in Q1, not just live infra.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="rounded-lg border border-border bg-surface px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-subtle">
              Playbook score
            </p>
            <p className="tabular text-lg font-semibold leading-none text-fg">
              {scorePct}
              <span className="text-sm font-normal text-muted">%</span>
            </p>
          </div>
          {health?.package_version ? (
            <div className="hidden rounded-lg border border-border bg-surface px-3 py-2 sm:block">
              <p className="text-[10px] font-medium uppercase tracking-wider text-subtle">
                Package
              </p>
              <p className="font-mono text-sm text-fg">v{health.package_version}</p>
            </div>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            aria-label="Refresh intel health"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
          <a
            href="https://intel.twzrd.xyz/llms.txt"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 text-xs font-medium text-fg transition-colors hover:border-border-strong hover:bg-surface-3"
          >
            Docs
            <ExternalLink className="h-3 w-3 text-muted" />
          </a>
        </div>
      </div>
    </header>
  );
}
