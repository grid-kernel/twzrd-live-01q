import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  Shield,
  ShieldAlert,
  ShieldBan,
  ShieldCheck,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  buildAttestationPack,
  type AttestationCard,
  type AttestationPack,
  type Decision,
} from "@/lib/attestation";
import { cn } from "@/lib/cn";

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      className="shrink-0"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          window.setTimeout(() => setOk(false), 1400);
        } catch {
          setOk(false);
        }
      }}
    >
      {ok ? (
        <>
          <Check className="h-3.5 w-3.5 text-ok" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copy
        </>
      )}
    </Button>
  );
}

function DecisionPill({ d }: { d: Decision }) {
  const map = {
    ALLOW: {
      cls: "border-ok/30 bg-ok/10 text-ok",
      Icon: ShieldCheck,
      label: "Allow",
    },
    WARN: {
      cls: "border-warn/30 bg-warn/10 text-warn",
      Icon: ShieldAlert,
      label: "Warn",
    },
    REVIEW: {
      cls: "border-warn/30 bg-warn/10 text-warn",
      Icon: ShieldAlert,
      label: "Review",
    },
    BLOCK: {
      cls: "border-danger/30 bg-danger/10 text-danger",
      Icon: ShieldBan,
      label: "Block",
    },
  } as const;
  const m = map[d];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        m.cls,
      )}
    >
      <m.Icon className="h-3 w-3" aria-hidden />
      {m.label}
    </span>
  );
}

function edgeFor(d: Decision) {
  if (d === "ALLOW") return "border-l-ok";
  if (d === "BLOCK") return "border-l-danger";
  return "border-l-warn";
}

function CardView({ c }: { c: AttestationCard }) {
  return (
    <article
      className={cn(
        "min-w-0 rounded-xl border border-border border-l-4 bg-surface-2/40 p-4",
        edgeFor(c.decision),
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <DecisionPill d={c.decision} />
        <span className="rounded-md border border-border bg-bg px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-subtle">
          Fictional sample
        </span>
      </div>
      <h3 className="mt-2 text-sm font-semibold text-fg">{c.label}</h3>
      <p className="mt-1 text-xs text-muted">{c.narrative}</p>
      <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <div>
          <dt className="text-subtle">Principal</dt>
          <dd className="mt-0.5 text-fg">{c.principal}</dd>
        </div>
        <div>
          <dt className="text-subtle">Agent</dt>
          <dd className="mt-0.5 font-mono text-[11px] text-fg">{c.agent_id}</dd>
        </div>
        <div>
          <dt className="text-subtle">Scope</dt>
          <dd className="mt-0.5 text-fg">{c.scope.join(" · ")}</dd>
        </div>
        <div>
          <dt className="text-subtle">Freshness</dt>
          <dd className="mt-0.5 text-fg">
            {c.freshness.snapshot_age}{" "}
            <span className="text-subtle">({c.freshness.status})</span>
          </dd>
        </div>
      </dl>
      <div className="mt-3">
        <div className="flex items-center justify-between gap-2 text-[11px] text-subtle">
          <span>Risk {c.risk.score}</span>
          <span>{c.receipt.note}</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg">
          <div
            className={cn(
              "h-full rounded-full",
              c.decision === "BLOCK"
                ? "bg-danger"
                : c.decision === "ALLOW"
                  ? "bg-ok"
                  : "bg-warn",
            )}
            style={{ width: `${Math.min(100, c.risk.score)}%` }}
          />
        </div>
        {c.risk.flags.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-1">
            {c.risk.flags.map((f) => (
              <li
                key={f}
                className="rounded-md border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px] text-subtle"
              >
                {f}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

export function AttestationPanel({
  compact = false,
  pack,
}: {
  compact?: boolean;
  pack?: AttestationPack;
}) {
  const data = useMemo(
    () =>
      pack ??
      buildAttestationPack({
        origin: typeof window !== "undefined" ? window.location.origin : "",
      }),
    [pack],
  );

  return (
    <section className="panel min-w-0 overflow-hidden">
      <div className="border-b border-border bg-surface-2/40 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand">
              Agent graph · Trust edge
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
              {data.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {data.thesis}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {compact ? (
              <Link
                to="/attest"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-fg hover:border-border-strong"
              >
                Full demo
              </Link>
            ) : null}
            <a
              href="/api/attestation"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-muted hover:text-fg"
            >
              JSON
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          </div>
        </div>

        <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {data.questions.map((q) => (
            <li
              key={q.id}
              className="rounded-xl border border-border bg-bg px-3 py-2.5"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-subtle">
                {q.id}
              </p>
              <p className="mt-1 text-xs font-medium leading-snug text-fg">
                {q.q}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid min-w-0 gap-3 p-5 sm:grid-cols-2 sm:p-6">
        {data.cards.map((c) => (
          <CardView key={c.id} c={c} />
        ))}
      </div>

      <div className="border-t border-border px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-fg" aria-hidden />
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
                {data.plug_in.title}
              </p>
            </div>
            <p className="mt-1 text-sm text-muted">
              Real free preflight — not a sample. Pay decisions always hit intel,
              never this board alone.
            </p>
          </div>
          <CopyBtn text={data.plug_in.free_preflight_curl} />
        </div>
        <pre className="mt-3 max-w-full overflow-x-auto whitespace-pre-wrap break-all rounded-xl border border-border bg-bg p-4 font-mono text-[12px] leading-relaxed text-fg/90 sm:break-normal sm:whitespace-pre sm:text-[13px]">
          {data.plug_in.free_preflight_curl}
        </pre>
        {!compact ? (
          <>
            <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
              Path B enforce
            </p>
            <pre className="mt-2 max-w-full overflow-x-auto whitespace-pre-wrap break-all rounded-xl border border-border bg-bg p-4 font-mono text-[12px] text-fg/90 sm:break-normal sm:whitespace-pre">
              {data.plug_in.path_b_gate}
            </pre>
            <p className="mt-3 text-xs text-muted">
              {data.plug_in.paid_trust_note}
            </p>
          </>
        ) : null}
      </div>

      {!compact ? (
        <div className="border-t border-border px-5 py-5 sm:px-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
            Distribution (corrected)
          </p>
          <p className="mt-1 text-sm text-muted">{data.distribution.note}</p>
          <p className="mt-2 text-xs text-subtle">
            {data.distribution.openclaw.registry_split}
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {data.distribution.openclaw.npm_packages.map((p) => (
              <li
                key={p.name}
                className="rounded-md border border-border bg-surface-2 px-2 py-1 font-mono text-[10px] text-muted"
              >
                {p.name}
                <span className="text-subtle"> · {p.role}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="space-y-1 border-t border-border bg-surface-2/30 px-5 py-3 text-xs text-subtle sm:px-6">
        <p>{data.disclaimer}</p>
        <p>{data.not_meta_affiliated}</p>
      </div>
    </section>
  );
}
