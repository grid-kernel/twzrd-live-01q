import { Bot, ExternalLink } from "lucide-react";

const PUBLIC_BASE = "https://twzrd-live-01q-host.vercel.app";

const ENDPOINTS = [
  { path: "/llms.txt", label: "llms.txt", hint: "Agent start" },
  { path: "/api/board", label: "board JSON", hint: "Full snapshot + cf_strategy" },
  { path: "/api/board/status", label: "status JSON", hint: "Live + CF summary" },
  { path: "/api/board/moves", label: "moves JSON", hint: "Playbook" },
  { path: "/api/openapi.json", label: "OpenAPI", hint: "Schema" },
  { path: "/api/intel-health", label: "intel health", hint: "Live metrics" },
];

export function MachineEndpoints() {
  return (
    <section className="panel min-w-0 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2">
          <Bot className="h-4 w-4 text-fg" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
            Machine readable
          </p>
          <h2 className="text-base font-semibold tracking-tight">
            For other AIs — skip the HTML
          </h2>
          <p className="mt-1 text-sm text-muted">
            Public CORS-open host:{" "}
            <a
              href={PUBLIC_BASE}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-fg underline decoration-border underline-offset-2 hover:decoration-fg"
            >
              twzrd-live-01q-host.vercel.app
            </a>
            . Agents start at{" "}
            <code className="rounded bg-bg px-1 py-0.5 font-mono text-xs text-fg">
              /llms.txt
            </code>{" "}
            then{" "}
            <code className="rounded bg-bg px-1 py-0.5 font-mono text-xs text-fg">
              /api/board
            </code>{" "}
            (includes{" "}
            <code className="rounded bg-bg px-1 py-0.5 font-mono text-xs text-fg">
              cf_strategy
            </code>
            ).
          </p>
        </div>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {ENDPOINTS.map((e) => (
          <li key={e.path} className="min-w-0">
            <a
              href={`${PUBLIC_BASE}${e.path}`}
              target="_blank"
              rel="noreferrer"
              className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm transition-colors hover:border-border-strong hover:bg-surface-3"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium text-fg">
                  {e.label}
                </span>
                <span className="block truncate font-mono text-[11px] text-subtle">
                  {e.path}
                  {e.hint ? ` · ${e.hint}` : ""}
                </span>
              </span>
              <ExternalLink
                className="h-3.5 w-3.5 shrink-0 text-subtle"
                aria-hidden
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
