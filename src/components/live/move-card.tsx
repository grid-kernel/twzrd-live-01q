import { Check, ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { Move } from "@/lib/playbook";
import { cn } from "@/lib/cn";

type Props = {
  move: Move;
  done: boolean;
  note: string;
  onToggle: () => void;
  onNote: (note: string) => void;
};

const impactClass: Record<string, string> = {
  critical: "border-danger/30 bg-danger/10 text-danger",
  high: "border-warn/30 bg-warn/10 text-warn",
  medium: "border-border bg-surface-3 text-muted",
};

const horizonLabel: Record<string, string> = {
  this_week: "This week",
  this_month: "This month",
  quarter: "Quarter",
};

export function MoveCard({ move, done, note, onToggle, onNote }: Props) {
  const [open, setOpen] = useState(!done);

  return (
    <article
      className={cn(
        "min-w-0 rounded-xl border bg-surface-2 transition-colors",
        done ? "border-ok/25 opacity-90" : "border-border",
      )}
    >
      <div className="flex min-w-0 items-start gap-3 p-4">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={done}
          aria-label={done ? `Mark incomplete: ${move.title}` : `Mark done: ${move.title}`}
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors",
            done
              ? "border-ok/40 bg-ok/20 text-ok"
              : "border-border-strong bg-bg text-transparent hover:border-fg/40",
          )}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "rounded-full border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                impactClass[move.impact],
              )}
            >
              {move.impact}
            </span>
            <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-subtle">
              {horizonLabel[move.horizon]}
            </span>
          </div>
          <h3
            className={cn(
              "mt-1.5 text-sm font-semibold tracking-tight sm:text-base",
              done && "text-muted line-through decoration-border-strong",
            )}
          >
            {move.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">{move.why}</p>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-3 inline-flex min-h-11 items-center gap-1 text-xs font-medium text-fg/80 hover:text-fg sm:min-h-0"
          >
            {open ? "Hide plan" : "Show plan"}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        </div>
      </div>

      {open ? (
        <div className="min-w-0 space-y-3 border-t border-border px-4 py-4 sm:pl-[3.25rem]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-subtle">
              How
            </p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-sm text-fg/90">
              {move.how.map((step) => (
                <li key={step} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-lg border border-border bg-bg/60 px-3 py-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-subtle">
              Success metric
            </p>
            <p className="mt-1 break-words text-sm text-fg">{move.metric}</p>
          </div>
          {move.links?.length ? (
            <div className="flex flex-wrap gap-2">
              {move.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs font-medium text-fg hover:border-border-strong hover:bg-surface-3 sm:h-8"
                >
                  {l.label}
                  <ExternalLink className="h-3 w-3 text-muted" />
                </a>
              ))}
            </div>
          ) : null}
          <label className="block">
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-subtle">
              Operator note
            </span>
            <textarea
              value={note}
              onChange={(e) => onNote(e.target.value)}
              rows={2}
              placeholder="What happened? Blockers, demo notes, wallet of design partner…"
              className="mt-1.5 w-full resize-y rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-subtle focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </label>
        </div>
      ) : null}
    </article>
  );
}
