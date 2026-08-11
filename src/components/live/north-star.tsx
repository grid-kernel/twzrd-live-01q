import { NORTH_STAR } from "@/lib/playbook";
import { Target } from "lucide-react";

export function NorthStar() {
  return (
    <section className="panel overflow-hidden p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-brand/30 bg-brand/10">
          <Target className="h-4 w-4 text-brand" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand-dim">
            {NORTH_STAR.title}
          </p>
          <p className="mt-2 text-base font-medium leading-snug tracking-tight text-fg text-balance sm:text-lg">
            {NORTH_STAR.statement}
          </p>
          <dl className="mt-4 grid gap-2 sm:grid-cols-3">
            <Metric rank="Primary" value={NORTH_STAR.primary} />
            <Metric rank="Secondary" value={NORTH_STAR.secondary} />
            <Metric rank="Tertiary" value={NORTH_STAR.tertiary} />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Metric({ rank, value }: { rank: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 px-3 py-2.5">
      <dt className="text-[10px] font-medium uppercase tracking-wider text-subtle">
        {rank}
      </dt>
      <dd className="mt-1 text-sm font-medium text-fg">{value}</dd>
    </div>
  );
}
