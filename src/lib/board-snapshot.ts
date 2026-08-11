import {
  FUNNEL_STAGES,
  MOVES,
  NORTH_STAR,
  PHASES,
  impactWeight,
  type Horizon,
  type Impact,
  type Move,
} from "./playbook";
import {
  deriveFunnel,
  liveDiagnosis,
  stageStatus,
  type Day0,
  type HealthPayload,
} from "./intel-types";
import {
  compactCfStrategy,
  loadCfStrategy,
  type CfStrategy,
} from "./cf-strategy";
import { buildPathBRunbook, type PathBRunbook } from "./path-b-runbook";

export const BOARD_VERSION = "1.2.0";
export const BOARD_ID = "twzrd-live-0-1q";

export type BoardMove = Move & {
  impact_weight: number;
  done: boolean;
};

export type BoardSnapshot = {
  schema: "twzrd.live_board/v1";
  id: string;
  version: string;
  generated_at: string;
  product: {
    name: string;
    owner: string;
    intel_base: string;
    human_ui: string;
    machine_start: string;
  };
  north_star: typeof NORTH_STAR;
  phases: typeof PHASES;
  funnel_stages: typeof FUNNEL_STAGES;
  moves: BoardMove[];
  live: {
    ok: boolean;
    error?: string;
    fetched_at: string;
    health?: {
      status?: string;
      package_version?: string;
      network?: string;
      mode?: string;
      settle_gate_enforcing?: boolean;
      settle_gate_shadow?: boolean;
      service_catalog?: HealthPayload["service_catalog"];
    };
    day0?: Day0;
    funnel: ReturnType<typeof deriveFunnel>;
    funnel_status: Record<
      keyof ReturnType<typeof deriveFunnel>,
      ReturnType<typeof stageStatus>
    >;
    diagnosis: string;
  };
  /** CF→Solana strategy (SPRAT fold). Not pay decisions. */
  cf_strategy: CfStrategy;
  /** Path B external integration runbook — refuse-before-sign. */
  path_b_runbook: PathBRunbook;
  next_actions: BoardMove[];
  dogfood: {
    title: string;
    command: string;
    expected: string;
    notes: string;
  };
  endpoints: Record<string, string>;
};

const DOGFOOD_CMD = `npm i twzrd-x402-gate@0.8.14 x402-solana@2.1.0 @x402/core @x402/fetch @x402/svm @solana/kit @scure/base
node node_modules/twzrd-x402-gate/bin/twzrd-gate-eval-refuse.js`;

async function fetchIntelHealth(): Promise<{
  ok: boolean;
  error?: string;
  health?: HealthPayload;
}> {
  try {
    const res = await fetch("https://intel.twzrd.xyz/health", {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, error: `Health returned ${res.status}` };
    }
    const health = (await res.json()) as HealthPayload;
    return { ok: true, health };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Health fetch failed",
    };
  }
}

function rankOpenMoves(doneIds: Set<string>, horizon: Horizon | "all" = "all") {
  return MOVES.filter((m) => !doneIds.has(m.id))
    .filter((m) => (horizon === "all" ? true : m.horizon === horizon))
    .sort((a, b) => {
      const hOrder = { this_week: 0, this_month: 1, quarter: 2 } as const;
      const hd = hOrder[a.horizon] - hOrder[b.horizon];
      if (hd !== 0) return hd;
      return impactWeight(b.impact) - impactWeight(a.impact);
    })
    .map((m) => toBoardMove(m, false));
}

function toBoardMove(m: Move, done = false): BoardMove {
  return {
    ...m,
    impact_weight: impactWeight(m.impact as Impact),
    done,
  };
}

export async function buildBoardSnapshot(opts?: {
  doneIds?: string[];
  origin?: string;
}): Promise<BoardSnapshot> {
  const doneIds = new Set(opts?.doneIds ?? []);
  const origin = (opts?.origin ?? "").replace(/\/$/, "");
  const fetched_at = new Date().toISOString();
  const [intel, cf_strategy] = await Promise.all([
    fetchIntelHealth(),
    loadCfStrategy(),
  ]);
  const path_b_runbook = buildPathBRunbook({
    origin,
    generated_at: fetched_at,
  });
  const day0 = intel.health?.day0;
  const funnel = deriveFunnel(day0);
  const moves = MOVES.map((m) => toBoardMove(m, doneIds.has(m.id)));
  const next_actions = rankOpenMoves(doneIds).slice(0, 5);

  const endpoints: Record<string, string> = {
    human_ui: origin ? `${origin}/` : "/",
    path_b_runbook: origin ? `${origin}/path-b` : "/path-b",
    path_b_json: origin ? `${origin}/api/path-b` : "/api/path-b",
    llms_txt: origin ? `${origin}/llms.txt` : "/llms.txt",
    board_json: origin ? `${origin}/api/board` : "/api/board",
    status_json: origin ? `${origin}/api/board/status` : "/api/board/status",
    moves_json: origin ? `${origin}/api/board/moves` : "/api/board/moves",
    openapi: origin ? `${origin}/api/openapi.json` : "/api/openapi.json",
    intel_health_proxy: origin
      ? `${origin}/api/intel-health`
      : "/api/intel-health",
    intel_upstream: "https://intel.twzrd.xyz/health",
    intel_llms: "https://intel.twzrd.xyz/llms.txt",
    intel_preflight: "https://intel.twzrd.xyz/v1/intel/preflight",
    sprat_source: cf_strategy.source,
    sprat_extract_note:
      "SPRAT GitHub is source extract / history only — not a second start-here",
  };

  return {
    schema: "twzrd.live_board/v1",
    id: BOARD_ID,
    version: BOARD_VERSION,
    generated_at: fetched_at,
    product: {
      name: "TWZRD Live 0→1Q",
      owner: "TWZRD",
      intel_base: "https://intel.twzrd.xyz",
      human_ui: endpoints.human_ui,
      machine_start: endpoints.llms_txt,
    },
    north_star: NORTH_STAR,
    phases: PHASES,
    funnel_stages: FUNNEL_STAGES,
    moves,
    live: {
      ok: intel.ok,
      error: intel.error,
      fetched_at,
      health: intel.health
        ? {
            status: intel.health.status,
            package_version: intel.health.package_version,
            network: intel.health.network,
            mode: intel.health.mode,
            settle_gate_enforcing: intel.health.settle_gate_enforcing,
            settle_gate_shadow: intel.health.settle_gate_shadow,
            service_catalog: intel.health.service_catalog,
          }
        : undefined,
      day0,
      funnel,
      funnel_status: {
        external_cards: stageStatus("external_cards", funnel.external_cards),
        gate_evals: stageStatus("gate_evals", funnel.gate_evals),
        gate_blocks: stageStatus("gate_blocks", funnel.gate_blocks),
        paid_external: stageStatus("paid_external", funnel.paid_external),
      },
      diagnosis: liveDiagnosis(funnel, day0),
    },
    cf_strategy,
    path_b_runbook,
    next_actions,
    dogfood: {
      title: "Cold-machine Path B refuse proof",
      command: DOGFOOD_CMD,
      expected: "signer_invocation_count=0 payment_retry_count=0",
      notes:
        "No wallet. No USDC. Primary Q1 proof that the buyer gate can refuse before sign. Full external runbook: /path-b",
    },
    endpoints,
  };
}

export function boardToLlmsTxt(board: BoardSnapshot): string {
  const cf = board.cf_strategy;
  const pb = board.path_b_runbook;
  const lines: string[] = [
    "# TWZRD Live 0→1Q — Machine guide",
    "",
    "> Operator board for getting intel.twzrd.xyz from live infra to live demand in Q1.",
    "> Humans use the UI. Agents should start here and prefer JSON endpoints.",
    "> **Canonical multi-agent host.** SPRAT CF strategy is folded into `/api/board` → `cf_strategy`.",
    "> **Path B external runbook** is folded into `/api/board` → `path_b_runbook` and `/api/path-b`.",
    "> SPRAT GitHub = source extract / history only (not a second start-here).",
    "",
    `schema: ${board.schema}`,
    `version: ${board.version}`,
    `generated_at: ${board.generated_at}`,
    "",
    "## Routing (locked)",
    "",
    "```text",
    "Live Board /llms.txt → /api/board  — start here (execution + CF strategy + Path B)",
    "  board.path_b_runbook              — external refuse-before-sign runbook",
    "  board.cf_strategy                 — CF→Solana posture (SPRAT fold)",
    "  board.next_actions / moves        — Path B 0→1Q execution",
    "  board.live                        — day0 funnel + intel health",
    "Human screen-share                  — /path-b",
    "intel.twzrd.xyz                     — product (should I pay?)",
    "SPRAT GitHub                        — extract / history only",
    "```",
    "",
    "| Agent needs… | Point at… |",
    "|---|---|",
    "| External Path B install + evidence | `/api/path-b` or `board.path_b_runbook` |",
    "| CF / Solana posture this week | `/api/board` → `cf_strategy` |",
    "| What next for external gate_evals | `/api/board` / `/api/board/status` |",
    "| Intel up / day0 | `/api/intel-health` or intel `/health` |",
    "| Should I pay this seller? | **intel preflight — never this board** |",
    "",
    "## North star",
    "",
    board.north_star.statement,
    "",
    `- Primary: ${board.north_star.primary}`,
    `- Secondary: ${board.north_star.secondary}`,
    `- Tertiary: ${board.north_star.tertiary}`,
    "",
    "## Live diagnosis",
    "",
    board.live.ok
      ? board.live.diagnosis
      : `Health unavailable: ${board.live.error ?? "unknown"}`,
    "",
    "### Funnel (external-demand oriented)",
    "",
    `| Stage | Value | Status |`,
    `|---|---:|---|`,
    `| External free cards | ${board.live.funnel.external_cards} | ${board.live.funnel_status.external_cards} |`,
    `| Gate evals (Path B) | ${board.live.funnel.gate_evals} | ${board.live.funnel_status.gate_evals} |`,
    `| Gate blocks | ${board.live.funnel.gate_blocks} | ${board.live.funnel_status.gate_blocks} |`,
    `| Paid trust external | ${board.live.funnel.paid_external} | ${board.live.funnel_status.paid_external} |`,
    "",
    "## Path B runbook (`path_b_runbook`)",
    "",
    `schema: ${pb.schema} · v${pb.version}`,
    "",
    `**Claim:** ${pb.claim}`,
    "",
    `**North star:** ${pb.north_star}`,
    "",
    "Partner sequence (locked): **Vicky → Nick → Lucas**",
    "",
    "Cold install:",
    "```bash",
    pb.install.cold_machine_cmd,
    "```",
    `Expected: \`${pb.install.expected_refuse}\``,
    "",
    "Order of ops:",
    ...pb.order_of_ops.map((o) => `- ${o}`),
    "",
    "Human UI: `/path-b` · Machine: `/api/path-b` (also `?format=md`)",
    "",
    "## CF strategy (`cf_strategy` — SPRAT fold)",
    "",
    `schema: ${cf.schema} · source ${cf.source_schema_version}${cf.source_role ? ` (${cf.source_role})` : ""} · live_source=${cf.live_source}`,
    "",
    `**Thesis:** ${cf.thesis.headline}`,
    "",
    cf.thesis.subcopy,
    "",
    `**Decision (${cf.decision.pick}):** ${cf.decision.summary}`,
    "",
    `- ship_now: ${cf.posture.ship_now.join(", ")}`,
    `- hold: ${cf.posture.hold.join(", ")}`,
    `- ready_not_shipped: ${cf.posture.ready_not_shipped.join(", ")}`,
    `- guardrail: ${cf.posture.guardrail}`,
    "",
    "### Signals",
    "",
    `- **A** \`${cf.signals.A.id}\` (${cf.signals.A.status}): ${cf.signals.A.fires_when}`,
    `- **B** \`${cf.signals.B.id}\` (${cf.signals.B.status}): ${cf.signals.B.fires_when}`,
    "",
    "### Supply lanes",
    "",
  ];

  for (const lane of cf.supply_lanes) {
    lines.push(
      `- **${lane.id}** (${lane.status}) — ${lane.name}: ${lane.detail}`,
    );
  }

  lines.push(
    "",
    `**Not this board:** ${cf.not_this_board}`,
    "",
    `Source extract (optional mirror): ${cf.source}`,
    "",
    "## Machine endpoints (prefer these)",
    "",
    `| Path | Purpose |`,
    `|---|---|`,
    `| GET /llms.txt | This guide |`,
    `| GET /path-b | Human Path B runbook (screen-share) |`,
    `| GET /api/path-b | Path B runbook JSON |`,
    `| GET /api/path-b?format=md | Path B runbook markdown |`,
    `| GET /api/board | Full board JSON (live + playbook + cf_strategy + path_b_runbook) |`,
    `| GET /api/board/status | Compact live status + cf_strategy summary |`,
    `| GET /api/board/moves | Playbook moves only |`,
    `| GET /api/board/moves?phase=truth&horizon=this_week&impact=critical | Filtered moves |`,
    `| GET /api/openapi.json | OpenAPI 3.1 for this service |`,
    `| GET /api/intel-health | Proxied intel.twzrd.xyz/health |`,
    "",
    "Query params on `/api/board` and `/api/board/moves`:",
    "- `phase` — truth | wedge | proof | distribution | convert",
    "- `horizon` — this_week | this_month | quarter",
    "- `impact` — critical | high | medium",
    "- `done` — comma-separated move ids to treat as completed (affects next_actions)",
    "",
    "## Next actions (highest leverage open)",
    "",
  );

  for (const [i, m] of board.next_actions.entries()) {
    lines.push(
      `${i + 1}. **${m.id}** — ${m.title} (${m.impact}, ${m.horizon})`,
    );
    lines.push(`   metric: ${m.metric}`);
  }

  lines.push("", "## Phases", "");
  for (const p of board.phases) {
    lines.push(`### ${p.label} (\`${p.id}\`)`);
    lines.push(p.subtitle);
    lines.push(`Outcome: ${p.outcome}`);
    lines.push("");
  }

  lines.push("## Dogfood (Path B)", "");
  lines.push("```bash");
  lines.push(board.dogfood.command);
  lines.push("```");
  lines.push(`Expected: ${board.dogfood.expected}`);
  lines.push("");
  lines.push("## Related TWZRD surfaces", "");
  lines.push("- https://intel.twzrd.xyz/llms.txt — Agent Intel MCP / HTTP");
  lines.push("- https://intel.twzrd.xyz/mcp — Hosted MCP");
  lines.push("- https://intel.twzrd.xyz/health — Day0 counters");
  lines.push(
    "- https://intel.twzrd.xyz/v1/intel/preflight — Pay decisions (product)",
  );
  lines.push("- https://twzrd.xyz — Product front door");
  lines.push(
    `- ${cf.source} — SPRAT source extract (history only, not a second host)`,
  );
  lines.push("");
  lines.push(
    "Agents: do not scrape the HTML UI. Use `/api/board`, `/api/path-b`, or `/api/board/status`.",
  );
  lines.push(
    "SPRAT GitHub is extract only — start here at Live Board, not SPRAT.",
  );
  lines.push("");

  return lines.join("\n");
}

export { compactCfStrategy };

export function filterMoves(
  moves: BoardMove[],
  q: { phase?: string; horizon?: string; impact?: string },
) {
  return moves.filter((m) => {
    if (q.phase && m.phase !== q.phase) return false;
    if (q.horizon && m.horizon !== q.horizon) return false;
    if (q.impact && m.impact !== q.impact) return false;
    return true;
  });
}

export function parseDoneParam(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function requestOrigin(request: Request): string {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedHost) {
    const proto = forwardedProto ?? "https";
    return `${proto}://${forwardedHost}`;
  }
  return url.origin;
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-allow-headers": "content-type, accept",
    },
  });
}

export function textResponse(
  body: string,
  contentType: string,
  status = 200,
): Response {
  return new Response(body, {
    status,
    headers: {
      "content-type": contentType,
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
    },
  });
}
