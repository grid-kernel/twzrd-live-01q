import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { CfStrategyPanel } from "@/components/live/cf-strategy-panel";
import { DogfoodBlock } from "@/components/live/dogfood-block";
import { FunnelPanel } from "@/components/live/funnel-panel";
import { HorizonFilter } from "@/components/live/horizon-filter";
import { MachineEndpoints } from "@/components/live/machine-endpoints";
import { MoveCard } from "@/components/live/move-card";
import { NextActions } from "@/components/live/next-actions";
import { NorthStar } from "@/components/live/north-star";
import { PhaseRail } from "@/components/live/phase-rail";
import { PulseHeader } from "@/components/live/pulse-header";
import { Button } from "@/components/ui/button";
import { fetchLiveSnapshot } from "@/lib/fetch-intel";
import type { LiveSnapshot } from "@/lib/intel-types";
import { useLiveStore } from "@/lib/live-store";
import { MOVES, PHASES, type PhaseId } from "@/lib/playbook";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [snapshot, setSnapshot] = useState<LiveSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isPending } = useCurrentUserState();

  const done = useLiveStore((s) => s.done);
  const notes = useLiveStore((s) => s.notes);
  const focusPhase = useLiveStore((s) => s.focusPhase);
  const focusHorizon = useLiveStore((s) => s.focusHorizon);
  const toggle = useLiveStore((s) => s.toggle);
  const setNote = useLiveStore((s) => s.setNote);
  const setFocusPhase = useLiveStore((s) => s.setFocusPhase);
  const setFocusHorizon = useLiveStore((s) => s.setFocusHorizon);
  const resetProgress = useLiveStore((s) => s.resetProgress);
  const score = useLiveStore((s) => s.score);

  const refresh = useCallback(async () => {
    setLoading(true);
    const snap = await fetchLiveSnapshot();
    setSnapshot(snap);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), 60_000);
    return () => window.clearInterval(id);
  }, [refresh]);

  const scoreNow = score();

  const doneByPhase = useMemo(() => {
    const map = {} as Record<PhaseId, { done: number; total: number }>;
    for (const p of PHASES) {
      const list = MOVES.filter((m) => m.phase === p.id);
      map[p.id] = {
        total: list.length,
        done: list.filter((m) => done[m.id]).length,
      };
    }
    return map;
  }, [done]);

  const filtered = useMemo(() => {
    return MOVES.filter((m) => {
      if (focusPhase !== "all" && m.phase !== focusPhase) return false;
      if (focusHorizon !== "all" && m.horizon !== focusHorizon) return false;
      return true;
    });
  }, [focusPhase, focusHorizon]);

  const phaseMeta =
    focusPhase === "all" ? null : PHASES.find((p) => p.id === focusPhase);

  return (
    <div className="min-h-dvh overflow-x-hidden bg-bg">
      <PulseHeader
        snapshot={snapshot}
        loading={loading}
        onRefresh={() => void refresh()}
        scorePct={scoreNow.pct}
      />

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 border-b border-border px-4 py-2 sm:px-6">
        <p className="min-w-0 truncate text-xs text-subtle">
          Progress:{" "}
          <span className="tabular text-muted">
            {scoreNow.done}/{scoreNow.total} moves · weighted {scoreNow.pct}%
          </span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {isPending ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-surface-3" />
          ) : user ? (
            <SignedIn>
              <UserButton />
            </SignedIn>
          ) : (
            <SignedOut>
              <Link
                to="/login"
                className="text-xs font-medium text-muted underline-offset-4 hover:text-fg hover:underline"
              >
                Sign in
              </Link>
            </SignedOut>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-5 overflow-x-hidden px-4 py-5 sm:space-y-6 sm:px-6 sm:py-8">
        <NorthStar />
        <FunnelPanel snapshot={snapshot} />
        <CfStrategyPanel />
        <MachineEndpoints />

        <div className="grid min-w-0 gap-5 lg:grid-cols-5 lg:gap-6">
          <div className="min-w-0 space-y-5 lg:col-span-3">
            <DogfoodBlock />
            <NextActions done={done} horizon={focusHorizon} />
          </div>
          <div className="min-w-0 lg:col-span-2">
            <section className="panel h-full p-5 sm:p-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
                Why this board
              </p>
              <h2 className="mt-1 text-base font-semibold tracking-tight">
                Live ≠ adopted
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
                <p>
                  intel.twzrd.xyz is already mainnet-live: MCP, preflight,
                  merchant cards, settle shadow, corpus. Day0 shows the gap —
                  external free cards are thin,{" "}
                  <span className="text-fg">gate_evals are zero</span>, paid
                  external trust is zero.
                </p>
                <p>
                  Q1 is not more surface area. It is Path B seats: buyer clients
                  that refuse before sign, proven by external metrics and refuse
                  transcripts.
                </p>
                <ul className="space-y-1.5 border-t border-border pt-3 text-xs text-subtle">
                  <li>· Check off moves as you ship them</li>
                  <li>· Notes stay in this browser</li>
                  <li>· Pulse refreshes from /health every 60s</li>
                  <li>· Agents: /llms.txt + /api/board (incl. cf_strategy)</li>
                </ul>
              </div>
            </section>
          </div>
        </div>

        <section className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
                Q1 playbook
              </p>
              <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                Moves that create live demand
              </h2>
              {phaseMeta ? (
                <p className="mt-1 max-w-2xl text-sm text-muted">
                  Outcome: {phaseMeta.outcome}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <HorizonFilter value={focusHorizon} onChange={setFocusHorizon} />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (
                    window.confirm(
                      "Reset all checkmarks and operator notes on this device?",
                    )
                  ) {
                    resetProgress();
                  }
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          <PhaseRail
            active={focusPhase}
            onChange={setFocusPhase}
            doneByPhase={doneByPhase}
          />

          <div className="min-w-0 space-y-3">
            {filtered.length === 0 ? (
              <p className="rounded-xl border border-border bg-surface px-4 py-6 text-center text-sm text-muted">
                No moves in this filter.
              </p>
            ) : (
              filtered.map((m) => (
                <MoveCard
                  key={m.id}
                  move={m}
                  done={!!done[m.id]}
                  note={notes[m.id] ?? ""}
                  onToggle={() => toggle(m.id)}
                  onNote={(n) => setNote(m.id, n)}
                />
              ))
            )}
          </div>
        </section>

        <footer className="border-t border-border pb-10 pt-6 text-center text-xs text-subtle">
          TWZRD · Machine trust for autonomous spend ·{" "}
          <a
            href="https://twzrd.xyz"
            target="_blank"
            rel="noreferrer"
            className="text-muted hover:text-fg"
          >
            twzrd.xyz
          </a>
          {" · "}
          <a href="/llms.txt" className="text-muted hover:text-fg">
            llms.txt
          </a>
          {" · "}
          <a href="/api/board" className="text-muted hover:text-fg">
            api/board
          </a>
        </footer>
      </main>
    </div>
  );
}
