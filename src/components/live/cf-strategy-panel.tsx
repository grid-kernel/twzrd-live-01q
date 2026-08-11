import { useEffect, useState } from "react";
import { Radar } from "lucide-react";
import type { CfStrategy } from "@/lib/cf-strategy";

export function CfStrategyPanel() {
  const [cf, setCf] = useState<CfStrategy | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/board", { cache: "no-store" });
        if (!res.ok) throw new Error(`board ${res.status}`);
        const data = (await res.json()) as { cf_strategy?: CfStrategy };
        if (!cancelled) setCf(data.cf_strategy ?? null);
      } catch (e) {
        if (!cancelled)
          setErr(e instanceof Error ? e.message : "Failed to load CF strategy");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="panel min-w-0 overflow-hidden p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-info/30 bg-info/10">
          <Radar className="h-4 w-4 text-info" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-info">
            CF strategy · SPRAT fold
          </p>
          {err ? (
            <p className="mt-2 text-sm text-danger">{err}</p>
          ) : !cf ? (
            <p className="mt-2 text-sm text-muted">Loading posture…</p>
          ) : (
            <>
              <h2 className="mt-2 text-base font-semibold tracking-tight text-balance sm:text-lg">
                {cf.thesis.headline}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {cf.thesis.subcopy}
              </p>
              <p className="mt-3 rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-fg">
                <span className="text-[10px] font-medium uppercase tracking-wider text-subtle">
                  Decision · {cf.decision.pick}
                </span>
                <span className="mt-1 block leading-snug">
                  {cf.decision.summary}
                </span>
              </p>

              <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-3">
                <PostureCol
                  label="Ship now"
                  items={cf.posture.ship_now}
                  tone="ok"
                />
                <PostureCol label="Hold" items={cf.posture.hold} tone="warn" />
                <PostureCol
                  label="Ready"
                  items={cf.posture.ready_not_shipped}
                  tone="info"
                />
              </div>

              <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2">
                <SignalCard letter="A" signal={cf.signals.A} />
                <SignalCard letter="B" signal={cf.signals.B} />
              </div>

              <p className="mt-4 text-xs leading-relaxed text-subtle">
                {cf.posture.guardrail}
              </p>
              <p className="mt-2 text-xs text-muted">
                <span className="text-subtle">Not this board:</span>{" "}
                {cf.not_this_board}
              </p>
              <p className="mt-2 text-[11px] text-subtle">
                source {cf.source_schema_version}
                {cf.live_source ? " · live SPRAT" : " · embedded"} · agents:{" "}
                <code className="text-muted">/api/board → cf_strategy</code>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function PostureCol({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "ok" | "warn" | "info";
}) {
  const toneClass =
    tone === "ok"
      ? "text-ok"
      : tone === "warn"
        ? "text-warn"
        : "text-info";
  return (
    <div className="min-w-0 rounded-lg border border-border bg-surface-2 px-3 py-2.5">
      <p className={`text-[10px] font-medium uppercase tracking-wider ${toneClass}`}>
        {label}
      </p>
      <ul className="mt-1.5 space-y-0.5">
        {items.map((id) => (
          <li key={id} className="truncate font-mono text-xs text-fg">
            {id}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SignalCard({
  letter,
  signal,
}: {
  letter: string;
  signal: CfStrategy["signals"]["A"];
}) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-surface-2 px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-subtle">
          Signal {letter}
        </p>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-warn">
          {signal.status}
        </span>
      </div>
      <p className="mt-1 font-mono text-xs text-fg">{signal.id}</p>
      <p className="mt-1 text-xs leading-snug text-muted">{signal.fires_when}</p>
    </div>
  );
}
