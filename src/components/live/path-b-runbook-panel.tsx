import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  ShieldBan,
  ShieldCheck,
  Terminal,
  Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  buildPathBRunbook,
  type EvidenceItem,
  type PathBRunbook,
} from "@/lib/path-b-runbook";
import { cn } from "@/lib/cn";

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="shrink-0"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-ok" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </Button>
  );
}

function EvidenceBadge({ d }: { d: EvidenceItem["decision"] }) {
  if (d === "BLOCK") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-danger/30 bg-danger/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-danger">
        <ShieldBan className="h-3 w-3" aria-hidden />
        Block
      </span>
    );
  }
  if (d === "ALLOW") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-ok/30 bg-ok/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ok">
        <ShieldCheck className="h-3 w-3" aria-hidden />
        Allow
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
      Both
    </span>
  );
}

export function PathBRunbookPanel({
  compact = false,
  runbook,
}: {
  compact?: boolean;
  runbook?: PathBRunbook;
}) {
  const rb = useMemo(
    () => runbook ?? buildPathBRunbook({ origin: typeof window !== "undefined" ? window.location.origin : "" }),
    [runbook],
  );
  const [activeStep, setActiveStep] = useState(0);
  const step = rb.steps[activeStep] ?? rb.steps[0];

  return (
    <section className="panel min-w-0 overflow-hidden">
      <div className="border-b border-border bg-surface-2/40 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand">
              Path B · External integration
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
              Refuse-before-sign runbook
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {rb.claim}
            </p>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-subtle">
              {rb.why_first}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!compact ? null : (
              <Link
                to="/path-b"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-fg transition-colors hover:border-border-strong hover:bg-surface-3"
              >
                Full screen-share
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            )}
            <a
              href="/api/path-b"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-muted transition-colors hover:border-border-strong hover:text-fg"
            >
              JSON
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          </div>
        </div>

        <ol className="mt-4 flex flex-wrap gap-2">
          {rb.order_of_ops.map((o, i) => (
            <li
              key={o}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] text-muted",
                i === 0
                  ? "border-brand/40 bg-brand/10 text-fg"
                  : "border-border bg-bg",
              )}
            >
              {o.replace(/^\d+\.\s*/, `${i + 1}. `)}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid min-w-0 gap-0 lg:grid-cols-12">
        {/* Steps nav */}
        <nav className="min-w-0 border-b border-border lg:col-span-4 lg:border-b-0 lg:border-r">
          <p className="px-5 pb-2 pt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-subtle sm:px-6">
            Install steps
          </p>
          <ul className="space-y-0.5 px-3 pb-4 sm:px-4">
            {rb.steps.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setActiveStep(i)}
                  className={cn(
                    "flex w-full min-w-0 items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    i === activeStep
                      ? "bg-surface-2 text-fg"
                      : "text-muted hover:bg-surface-2/60 hover:text-fg",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-[11px] tabular",
                      i === activeStep
                        ? "border-brand/40 bg-brand/10 text-fg"
                        : "border-border bg-bg text-subtle",
                    )}
                  >
                    {s.n}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium leading-snug">
                      {s.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-subtle">
                      {s.duration} · {s.operator}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Step detail */}
        <div className="min-w-0 space-y-4 p-5 sm:p-6 lg:col-span-8">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
              Step {step.n} · {step.duration}
            </p>
            <h3 className="mt-1 text-base font-semibold tracking-tight">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {step.detail}
            </p>
          </div>

          {step.commands?.length ? (
            <div className="min-w-0">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-subtle">
                  <Terminal className="h-3.5 w-3.5" aria-hidden />
                  Commands
                </div>
                <CopyButton text={step.commands.join("\n\n")} />
              </div>
              <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-all rounded-xl border border-border bg-bg p-4 font-mono text-[12px] leading-relaxed text-fg/90 sm:break-normal sm:whitespace-pre sm:text-[13px]">
                {step.commands.join("\n\n")}
              </pre>
            </div>
          ) : null}

          {step.expected?.length ? (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ok">
                Expected
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted">
                {step.expected.map((e) => (
                  <li key={e} className="flex gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {step.pitfalls?.length ? (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-warn">
                Pitfalls
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted">
                {step.pitfalls.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warn" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={activeStep >= rb.steps.length - 1}
              onClick={() =>
                setActiveStep((s) => Math.min(rb.steps.length - 1, s + 1))
              }
            >
              Next step
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Evidence */}
      <div className="border-t border-border px-5 py-5 sm:px-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
          Evidence checklist
        </p>
        <h3 className="mt-1 text-base font-semibold tracking-tight">
          BLOCK / ALLOW capture
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Every external session must leave a machine-readable trail. Pass/fail
          is binary — no “looks good” screenshots of dashboards alone.
        </p>
        <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">
          {rb.evidence.map((e) => (
            <article
              key={e.id}
              className="min-w-0 rounded-xl border border-border bg-surface-2/50 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <EvidenceBadge d={e.decision} />
                <code className="font-mono text-[10px] text-subtle">{e.id}</code>
              </div>
              <h4 className="mt-2 text-sm font-medium text-fg">{e.title}</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                {e.capture}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ok">
                Pass: {e.pass_if}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-danger/90">
                Fail: {e.fail_if}
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* Partner sequence */}
      <div className="border-t border-border px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2">
            <Users className="h-4 w-4 text-fg" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
              Locked sequence
            </p>
            <h3 className="text-base font-semibold tracking-tight">
              Vicky → Nick → Lucas
            </h3>
            <p className="mt-1 text-sm text-muted">
              Do not expand a 10-target spray list until one external artifact
              exists. Distribution package after proof, not before.
            </p>
          </div>
        </div>
        <ol className="mt-4 grid min-w-0 gap-3 sm:grid-cols-3">
          {rb.partner_sequence.map((p) => (
            <li
              key={p.codename}
              className="min-w-0 rounded-xl border border-border bg-bg p-4"
            >
              <p className="font-mono text-[11px] text-brand">
                {String(p.order).padStart(2, "0")}
              </p>
              <p className="mt-1 text-sm font-semibold text-fg">{p.codename}</p>
              <p className="mt-1 text-xs text-muted">{p.role}</p>
              <p className="mt-3 text-xs leading-relaxed text-subtle">
                <span className="text-muted">Goal: </span>
                {p.session_goal}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-subtle">
                <span className="text-muted">Do not: </span>
                {p.do_not}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Session script + artifact */}
      {!compact ? (
        <>
          <div className="border-t border-border px-5 py-5 sm:px-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
              {rb.session_script.title}
            </p>
            <ul className="mt-3 space-y-2">
              {rb.session_script.minutes.map((m) => (
                <li
                  key={m.t}
                  className="grid min-w-0 gap-1 rounded-xl border border-border bg-surface-2/40 px-3 py-2.5 sm:grid-cols-[4rem_1fr]"
                >
                  <span className="font-mono text-xs tabular text-brand">
                    {m.t}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-fg">{m.say}</p>
                    <p className="mt-0.5 text-xs text-subtle">Show: {m.show}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
                  Artifact
                </p>
                <h3 className="mt-1 text-base font-semibold tracking-tight">
                  {rb.artifact.title}
                </h3>
                <p className="mt-1 max-w-xl text-sm text-muted">
                  {rb.artifact.publish_rule}
                </p>
              </div>
              <CopyButton
                text={JSON.stringify(rb.artifact.example_shape, null, 2)}
                label="Copy template"
              />
            </div>
            <pre className="mt-4 max-w-full overflow-x-auto rounded-xl border border-border bg-bg p-4 font-mono text-[11px] leading-relaxed text-fg/90 sm:text-[12px]">
              {JSON.stringify(rb.artifact.example_shape, null, 2)}
            </pre>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {rb.artifact.required_fields.map((f) => (
                <li
                  key={f}
                  className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-subtle"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}

      <div className="border-t border-border bg-surface-2/30 px-5 py-3 text-xs text-subtle sm:px-6">
        {rb.not_this_runbook}
      </div>
    </section>
  );
}
