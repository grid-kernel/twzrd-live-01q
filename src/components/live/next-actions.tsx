import { ArrowRight } from "lucide-react";
import { MOVES, impactWeight, type Horizon } from "@/lib/playbook";

type Props = {
  done: Record<string, boolean>;
  horizon: Horizon | "all";
};

export function NextActions({ done, horizon }: Props) {
  const open = MOVES.filter((m) => !done[m.id])
    .filter((m) => (horizon === "all" ? true : m.horizon === horizon))
    .sort((a, b) => {
      const hOrder = { this_week: 0, this_month: 1, quarter: 2 } as const;
      const hd = hOrder[a.horizon] - hOrder[b.horizon];
      if (hd !== 0) return hd;
      return impactWeight(b.impact) - impactWeight(a.impact);
    })
    .slice(0, 3);

  if (open.length === 0) {
    return (
      <section className="panel min-w-0 p-5 sm:p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
          Next actions
        </p>
        <p className="mt-2 text-sm text-muted">
          All moves in this filter are complete. Expand horizon or reset if you
          want a fresh board.
        </p>
      </section>
    );
  }

  return (
    <section className="panel min-w-0 p-5 sm:p-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
        Do these next
      </p>
      <h2 className="mt-1 text-base font-semibold tracking-tight">
        Highest leverage open work
      </h2>
      <ol className="mt-4 space-y-3">
        {open.map((m, i) => (
          <li
            key={m.id}
            className="flex min-w-0 gap-3 rounded-xl border border-border bg-surface-2 p-3"
          >
            <span className="tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-bg text-xs font-semibold text-muted">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-fg">{m.title}</p>
              <p className="mt-0.5 break-words text-xs text-muted">
                {m.impact} · {m.horizon.replace("_", " ")} · {m.metric}
              </p>
            </div>
            <ArrowRight
              className="mt-1 hidden h-4 w-4 shrink-0 text-subtle sm:block"
              aria-hidden
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
