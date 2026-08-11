import { FUNNEL_STAGES } from "@/lib/playbook";
import {
  deriveFunnel,
  liveDiagnosis,
  stageStatus,
  type LiveSnapshot,
} from "@/lib/intel-types";
import { cn } from "@/lib/cn";

const statusTone: Record<string, string> = {
  empty: "text-danger border-danger/25 bg-danger/10",
  thin: "text-warn border-warn/25 bg-warn/10",
  moving: "text-info border-info/25 bg-info/10",
  healthy: "text-ok border-ok/25 bg-ok/10",
};

const statusLabel: Record<string, string> = {
  empty: "Empty",
  thin: "Thin",
  moving: "Moving",
  healthy: "Healthy",
};

type Props = {
  snapshot: LiveSnapshot | null;
};

export function FunnelPanel({ snapshot }: Props) {
  const day0 = snapshot?.health?.day0;
  const funnel = deriveFunnel(day0);
  const diagnosis = liveDiagnosis(funnel, day0);
  const catalog = snapshot?.health?.service_catalog;

  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
            Live demand funnel
          </p>
          <h2 className="text-base font-semibold tracking-tight text-fg sm:text-lg">
            What Day0 actually says
          </h2>
        </div>
        {snapshot?.fetchedAt ? (
          <p className="text-xs text-subtle">
            Pulled {new Date(snapshot.fetchedAt).toLocaleString()}
          </p>
        ) : null}
      </div>

      {!snapshot?.ok ? (
        <p className="mt-4 rounded-lg border border-warn/30 bg-warn/10 px-3 py-2 text-sm text-warn">
          {snapshot?.error ?? "Waiting for intel health…"}
        </p>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FUNNEL_STAGES.map((stage, i) => {
          const value = funnel[stage.key];
          const status = stageStatus(stage.key, value);
          return (
            <div
              key={stage.key}
              className="relative rounded-xl border border-border bg-surface-2 p-4"
            >
              {i < FUNNEL_STAGES.length - 1 ? (
                <div
                  className="pointer-events-none absolute -right-2 top-1/2 z-10 hidden h-px w-4 -translate-y-1/2 bg-border lg:block"
                  aria-hidden
                />
              ) : null}
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted">{stage.label}</p>
                <span
                  className={cn(
                    "rounded-full border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                    statusTone[status],
                  )}
                >
                  {statusLabel[status]}
                </span>
              </div>
              <p className="tabular mt-2 text-3xl font-semibold tracking-tight text-fg">
                {value.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-subtle">{stage.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-bg/50 p-4 lg:col-span-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
            Diagnosis
          </p>
          <p className="mt-2 text-sm leading-relaxed text-fg text-balance">
            {diagnosis}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
          <Stat
            label="Internal cards"
            value={day0?.free_card_hits_internal ?? 0}
            warn
          />
          <Stat label="Receipt verifies" value={day0?.receipt_verifies ?? 0} />
          <Stat
            label="Live 402 services"
            value={catalog?.live_402_service_count ?? 0}
          />
          <Stat
            label="Settle gate"
            value={
              snapshot?.health?.settle_gate_enforcing
                ? "Enforce"
                : snapshot?.health?.settle_gate_shadow
                  ? "Shadow"
                  : "Off"
            }
          />
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  warn,
}: {
  label: string;
  value: number | string;
  warn?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 px-3 py-2.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-subtle">
        {label}
      </p>
      <p
        className={cn(
          "tabular mt-1 text-sm font-semibold",
          warn ? "text-warn" : "text-fg",
        )}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}
