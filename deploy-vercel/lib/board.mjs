import { loadCfStrategy, compactCfStrategy } from "./cf-strategy.mjs";
// src/lib/playbook.ts
var PHASES = [
  {
    id: "truth",
    label: "01 \xB7 Truth",
    subtitle: "Separate live infra from live demand",
    outcome: "One north-star metric board that only counts external demand."
  },
  {
    id: "wedge",
    label: "02 \xB7 Wedge",
    subtitle: "Path B is the product, not preflight alone",
    outcome: "Every install demo ends with refuse-before-sign (signer=0)."
  },
  {
    id: "proof",
    label: "03 \xB7 Proof",
    subtitle: "Make the gate dogfoodable in under 5 minutes",
    outcome: "A cold machine can prove Path B without a wallet or USDC."
  },
  {
    id: "distribution",
    label: "04 \xB7 Distribution",
    subtitle: "Put the gate where agents already pay",
    outcome: "3 embed seats live + weekly outbound that creates gate_evals."
  },
  {
    id: "convert",
    label: "05 \xB7 Convert",
    subtitle: "Free card \u2192 gate install \u2192 optional V6 proof",
    outcome: "First external paid trust + first external gate_evals > 0."
  }
];
var MOVES = [
  {
    id: "truth-external-only",
    phase: "truth",
    title: "Pin external-only Day0 on the wall",
    why: "Health already separates free_card_hits_external from internal swarm. If you manage to total hits, you will celebrate dogfood and miss that demand is near zero.",
    how: [
      "Dashboard tile: free_card_hits_external, gate_evals, paid_trust_payer_external only.",
      "Never report free_card_hits_internal in investor/partner decks.",
      "Add a weekly screenshot of /health day0.door_zero with external basis."
    ],
    metric: "Team can recite external free cards, gate_evals, paid_trust_external from memory",
    impact: "critical",
    horizon: "this_week",
    links: [{ label: "Live health", href: "https://intel.twzrd.xyz/health" }]
  },
  {
    id: "truth-north-star",
    phase: "truth",
    title: "Declare Path B north star for Q1",
    why: "Preflight is advisory. Paid V6 is portable proof. Neither is enforcement. Live 0\u21921 means a client honors block before signTransaction.",
    how: [
      "Write one sentence: Success = external gate_evals with signer_invocation_count=0 on refuse.",
      "Secondary: external free cards. Tertiary: paid_trust_payer_external.",
      "Kill any metric that rewards internal template alias hits."
    ],
    metric: "gate_evals (external) is the only primary OKR",
    impact: "critical",
    horizon: "this_week"
  },
  {
    id: "wedge-path-b",
    phase: "wedge",
    title: "Lead every conversation with refuse-before-sign",
    why: "MCP tools and free preflight create awareness but do not block spend. The install that refuses is the wedge competitors cannot soft-ship as a dashboard.",
    how: [
      "Hero line: Before your agent signs, TWZRD can refuse.",
      "Demo order: refuse fixture \u2192 gate eval \u2192 transcript with signer=0.",
      "Only then show MCP / merchant_card / V6 as supporting rails."
    ],
    metric: "100% of partner demos show Path B first",
    impact: "critical",
    horizon: "this_week",
    links: [
      {
        label: "Refuse fixture",
        href: "https://intel.twzrd.xyz/v1/intel/refuse-fixture"
      },
      { label: "llms.txt", href: "https://intel.twzrd.xyz/llms.txt" }
    ]
  },
  {
    id: "wedge-message",
    phase: "wedge",
    title: "Freeze a one-screen message hierarchy",
    why: "Current surfaces list 24 tools, settle rails, market data, and watch hooks. 0\u21921 needs a single sentence and a single install path.",
    how: [
      "Primary: Machine trust for autonomous spend \u2014 block before sign.",
      "Proof: npm i twzrd-x402-gate + refuse eval binary.",
      "Optional: hosted MCP for discovery; V6 only after trust is enforced."
    ],
    metric: "One paragraph + one command on every surface (intel, X, Smithery blurb)",
    impact: "high",
    horizon: "this_week"
  },
  {
    id: "proof-cold-machine",
    phase: "proof",
    title: "Cold-machine Path B under 5 minutes",
    why: "Optional peers of the gate are not auto-installed. Broken first runs kill distribution. Q1 lives or dies on frictionless dogfood.",
    how: [
      "Publish a single copy-paste block that installs gate + peers + runs refuse eval.",
      "Record expected: signer_invocation_count=0 payment_retry_count=0.",
      "File every break report as a P0 until the script is green on a fresh machine."
    ],
    metric: "3 independent people complete refuse proof without help",
    impact: "critical",
    horizon: "this_week",
    links: [
      {
        label: "Gate package",
        href: "https://www.npmjs.com/package/twzrd-x402-gate"
      }
    ]
  },
  {
    id: "proof-public-transcript",
    phase: "proof",
    title: "Ship a public refuse transcript artifact",
    why: "Screenshots of allow/warn cards look like every other trust API. A refuse transcript is unique and shareable.",
    how: [
      "Commit a sanitized JSON transcript from twzrd-gate-eval-refuse.",
      "Pin it on X + README with the install one-liner.",
      "Invite partners: run this and paste your signer_invocation_count."
    ],
    metric: "At least 5 public replies/forks with signer=0",
    impact: "high",
    horizon: "this_month"
  },
  {
    id: "dist-embed-seats",
    phase: "distribution",
    title: "Win 3 embed seats where x402 clients already live",
    why: "You cannot out-content Coinbase AgentKit, OpenClaw, or Claude Code install bases. You must be a default onBeforePayment hook inside them.",
    how: [
      "AgentKit / x402 clients: keep registeredServices + README example warm.",
      "OpenClaw / ClawHub skill: default preflight plugin with enforce mode docs.",
      "One framework adapter (eliza / facilitator) with a public reference agent."
    ],
    metric: "3 embed docs live that mention installTwzrdAutoGate or equivalent",
    impact: "critical",
    horizon: "this_month",
    links: [
      {
        label: "Smithery listing",
        href: "https://smithery.ai/servers/wzrd/twzrd-agent-intel"
      },
      { label: "MCP endpoint", href: "https://intel.twzrd.xyz/mcp" },
      { label: "Skill", href: "https://intel.twzrd.xyz/skill.md" }
    ]
  },
  {
    id: "dist-design-partners",
    phase: "distribution",
    title: "Close 5 design-partner agent operators",
    why: "External free cards at ~30 with zero gate_evals means discovery without install. Operators who already lose USDC to bad counterparties feel the pain.",
    how: [
      "Target: Solana x402 buyers who run recurring agent spend (multi_merchant cohort exists on corpus).",
      "Offer: white-glove gate install + shadow mode for 14 days, then enforce.",
      "Success: their gate_evals show on health (even if fail-open is off)."
    ],
    metric: "5 LOIs or shipped installs; \u22651 external gate_eval/day",
    impact: "critical",
    horizon: "this_month"
  },
  {
    id: "dist-outbound-rhythm",
    phase: "distribution",
    title: "Weekly refuse-demo outbound rhythm",
    why: "Infra that is live but quiet dies. Outbound must force Path B, not link spam to /llms.txt.",
    how: [
      "2 demos/week to agent frameworks, facilitators, and x402 merchants.",
      "Each demo ends with them running the refuse binary themselves.",
      "Log outcome: no-show / ran proof / installed / gate_eval observed."
    ],
    metric: "8 demos/month with \u226550% completing refuse proof live",
    impact: "high",
    horizon: "this_month"
  },
  {
    id: "convert-funnel",
    phase: "convert",
    title: "Instrument free \u2192 gate \u2192 paid as a real funnel",
    why: "door_zero already sketches grade \u2192 free card \u2192 paid. 0\u21921 needs gate install as the missing middle.",
    how: [
      "Event: preflight (external) \u2192 gate package download / eval hit \u2192 gate_eval \u2192 optional V6.",
      "If free cards grow but gate_evals stay 0, messaging is wrong \u2014 fix demos, not ads.",
      "Do not optimize paid V6 until gate_evals move; paid is proof, not enforcement."
    ],
    metric: "Funnel chart reviewed weekly; gate_evals is middle stage",
    impact: "high",
    horizon: "this_month"
  },
  {
    id: "convert-first-external-paid",
    phase: "convert",
    title: "Earn first paid_trust_payer_external",
    why: "Zero paid external trust means no one bought portable proof. Useful signal after gate installs exist \u2014 portable receipt for downstream agents.",
    how: [
      "After design partner gate is live, offer V6 as audit trail for compliance / multi-agent handoff.",
      "Price already set (0.05 USDC) \u2014 do not change price; change why they need a receipt.",
      "Verify with offline twzrd-receipt-verifier in the same session."
    ],
    metric: "paid_trust_payer_external \u2265 1 and receipt_verify_valid \u2265 1",
    impact: "medium",
    horizon: "quarter",
    links: [
      {
        label: "Receipt example",
        href: "https://intel.twzrd.xyz/v1/receipts/example"
      }
    ]
  },
  {
    id: "convert-settle-gate-path",
    phase: "convert",
    title: "Keep settle_gate in shadow until Path B has demand",
    why: "settle_gate_enforcing=false is correct for 0\u21921. Enforcing seller screens before you have buyer-gate installs confuses the wedge.",
    how: [
      "Leave settle gate in shadow; log only.",
      "Spend Q1 cycles on buyer AutoGate installs, not facilitator policy surface area.",
      "Revisit enforce only after external gate_evals are healthy."
    ],
    metric: "No premature settle_gate_enforcing=true without gate demand",
    impact: "medium",
    horizon: "quarter"
  }
];
var NORTH_STAR = {
  title: "Live 0\u21921 for Q1",
  statement: "An external agent client installs the TWZRD buyer gate and honors block before the wallet signs \u2014 proven by gate_evals and refuse transcripts, not by free MCP hits.",
  primary: "External gate_evals (Path B)",
  secondary: "free_card_hits_external",
  tertiary: "paid_trust_payer_external"
};
var FUNNEL_STAGES = [
  {
    key: "external_cards",
    label: "External free cards",
    hint: "Advisory demand only"
  },
  {
    key: "gate_evals",
    label: "Gate evals",
    hint: "Path B \u2014 primary"
  },
  {
    key: "gate_blocks",
    label: "Gate blocks",
    hint: "Refusals that saved spend"
  },
  {
    key: "paid_external",
    label: "Paid trust (external)",
    hint: "Portable V6 proof"
  }
];
function impactWeight(impact) {
  if (impact === "critical") return 5;
  if (impact === "high") return 3;
  return 1;
}

// src/lib/intel-types.ts
function deriveFunnel(day0) {
  return {
    external_cards: day0?.free_card_hits_external ?? 0,
    gate_evals: day0?.gate_evals ?? 0,
    gate_blocks: day0?.gate_blocks ?? 0,
    paid_external: day0?.paid_trust_payer_external ?? 0
  };
}
function stageStatus(key, value) {
  if (key === "external_cards") {
    if (value <= 0) return "empty";
    if (value < 50) return "thin";
    if (value < 500) return "moving";
    return "healthy";
  }
  if (key === "gate_evals" || key === "gate_blocks") {
    if (value <= 0) return "empty";
    if (value < 10) return "thin";
    if (value < 100) return "moving";
    return "healthy";
  }
  if (value <= 0) return "empty";
  if (value < 5) return "thin";
  if (value < 50) return "moving";
  return "healthy";
}
function liveDiagnosis(funnel, day0) {
  const internal = day0?.free_card_hits_internal ?? 0;
  if (funnel.gate_evals === 0 && funnel.external_cards === 0) {
    return "Infra is live; demand is not. Zero external free cards and zero gate_evals \u2014 Path B has no external seat yet.";
  }
  if (funnel.gate_evals === 0 && funnel.external_cards > 0) {
    return "Advisory demand exists without enforcement. Free cards are happening; nobody has installed the buyer gate. Lead with refuse-before-sign.";
  }
  if (funnel.gate_evals > 0 && funnel.paid_external === 0) {
    return "Path B is moving. Next: design partners and optional V6 as portable proof \u2014 do not confuse receipts with enforcement.";
  }
  if (internal > funnel.external_cards * 10) {
    return "Internal swarm dominates free cards. Treat only free_card_hits_external and external payers as demand.";
  }
  return "Funnel has signal. Keep Path B primary; grow embed seats and design partners.";
}

// src/lib/board-snapshot.ts
var BOARD_VERSION = "1.1.0";
var BOARD_ID = "twzrd-live-0-1q";
var DOGFOOD_CMD = `npm i twzrd-x402-gate@0.8.14 x402-solana@2.1.0 @x402/core @x402/fetch @x402/svm @solana/kit @scure/base
node node_modules/twzrd-x402-gate/bin/twzrd-gate-eval-refuse.js`;
async function fetchIntelHealth() {
  try {
    const res = await fetch("https://intel.twzrd.xyz/health", {
      headers: { accept: "application/json" },
      cache: "no-store"
    });
    if (!res.ok) {
      return { ok: false, error: `Health returned ${res.status}` };
    }
    const health = await res.json();
    return { ok: true, health };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Health fetch failed"
    };
  }
}
function rankOpenMoves(doneIds, horizon = "all") {
  return MOVES.filter((m) => !doneIds.has(m.id)).filter((m) => horizon === "all" ? true : m.horizon === horizon).sort((a, b) => {
    const hOrder = { this_week: 0, this_month: 1, quarter: 2 };
    const hd = hOrder[a.horizon] - hOrder[b.horizon];
    if (hd !== 0) return hd;
    return impactWeight(b.impact) - impactWeight(a.impact);
  }).map((m) => toBoardMove(m, false));
}
function toBoardMove(m, done = false) {
  return {
    ...m,
    impact_weight: impactWeight(m.impact),
    done
  };
}
async function buildBoardSnapshot(opts) {
  const doneIds = new Set(opts?.doneIds ?? []);
  const origin = (opts?.origin ?? "").replace(/\/$/, "");
  const fetched_at = (/* @__PURE__ */ new Date()).toISOString();
  const [intel, cf_strategy] = await Promise.all([
    fetchIntelHealth(),
    loadCfStrategy()
  ]);
  const day0 = intel.health?.day0;
  const funnel = deriveFunnel(day0);
  const moves = MOVES.map((m) => toBoardMove(m, doneIds.has(m.id)));
  const next_actions = rankOpenMoves(doneIds).slice(0, 5);
  const endpoints = {
    human_ui: origin ? `${origin}/` : "/",
    llms_txt: origin ? `${origin}/llms.txt` : "/llms.txt",
    board_json: origin ? `${origin}/api/board` : "/api/board",
    status_json: origin ? `${origin}/api/board/status` : "/api/board/status",
    moves_json: origin ? `${origin}/api/board/moves` : "/api/board/moves",
    openapi: origin ? `${origin}/api/openapi.json` : "/api/openapi.json",
    intel_health_proxy: origin ? `${origin}/api/intel-health` : "/api/intel-health",
    intel_upstream: "https://intel.twzrd.xyz/health",
    intel_llms: "https://intel.twzrd.xyz/llms.txt",
    intel_preflight: "https://intel.twzrd.xyz/v1/intel/preflight",
    sprat_source: "https://raw.githubusercontent.com/twzrd-sol/sprat-brief/main/sprat.json"
  };
  return {
    schema: "twzrd.live_board/v1",
    id: BOARD_ID,
    version: BOARD_VERSION,
    generated_at: fetched_at,
    product: {
      name: "TWZRD Live 0\u21921Q",
      owner: "TWZRD",
      intel_base: "https://intel.twzrd.xyz",
      human_ui: endpoints.human_ui,
      machine_start: endpoints.llms_txt
    },
    north_star: NORTH_STAR,
    phases: PHASES,
    funnel_stages: FUNNEL_STAGES,
    moves,
    live: {
      ok: intel.ok,
      error: intel.error,
      fetched_at,
      health: intel.health ? {
        status: intel.health.status,
        package_version: intel.health.package_version,
        network: intel.health.network,
        mode: intel.health.mode,
        settle_gate_enforcing: intel.health.settle_gate_enforcing,
        settle_gate_shadow: intel.health.settle_gate_shadow,
        service_catalog: intel.health.service_catalog
      } : void 0,
      day0,
      funnel,
      funnel_status: {
        external_cards: stageStatus("external_cards", funnel.external_cards),
        gate_evals: stageStatus("gate_evals", funnel.gate_evals),
        gate_blocks: stageStatus("gate_blocks", funnel.gate_blocks),
        paid_external: stageStatus("paid_external", funnel.paid_external)
      },
      diagnosis: liveDiagnosis(funnel, day0)
    },
    cf_strategy,
    next_actions,
    dogfood: {
      title: "Cold-machine Path B refuse proof",
      command: DOGFOOD_CMD,
      expected: "signer_invocation_count=0 payment_retry_count=0",
      notes: "No wallet. No USDC. Primary Q1 proof that the buyer gate can refuse before sign."
    },
    endpoints
  };
}
function boardToLlmsTxt(board) {
  const lines = [
    "# TWZRD Live 0\u21921Q \u2014 Machine guide",
    "",
    "> Operator board for getting intel.twzrd.xyz from live infra to live demand in Q1.",
    "> Humans use the UI. Agents should start here and prefer JSON endpoints.",
    "> **Canonical multi-agent host.** SPRAT CF strategy is folded into `/api/board` → `cf_strategy`.",
    "",
    `schema: ${board.schema}`,
    `version: ${board.version}`,
    `generated_at: ${board.generated_at}`,
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
    board.live.ok ? board.live.diagnosis : `Health unavailable: ${board.live.error ?? "unknown"}`,
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
    "## CF strategy (`cf_strategy` — SPRAT fold)",
    "",
    `schema: ${board.cf_strategy.schema} · source ${board.cf_strategy.source_schema_version} · live_source=${board.cf_strategy.live_source}`,
    "",
    `**Thesis:** ${board.cf_strategy.thesis.headline}`,
    "",
    board.cf_strategy.thesis.subcopy,
    "",
    `**Decision (${board.cf_strategy.decision.pick}):** ${board.cf_strategy.decision.summary}`,
    "",
    `- ship_now: ${board.cf_strategy.posture.ship_now.join(", ")}`,
    `- hold: ${board.cf_strategy.posture.hold.join(", ")}`,
    `- ready_not_shipped: ${board.cf_strategy.posture.ready_not_shipped.join(", ")}`,
    `- guardrail: ${board.cf_strategy.posture.guardrail}`,
    "",
    "### Signals",
    "",
    `- **A** \`${board.cf_strategy.signals.A.id}\` (${board.cf_strategy.signals.A.status}): ${board.cf_strategy.signals.A.fires_when}`,
    `- **B** \`${board.cf_strategy.signals.B.id}\` (${board.cf_strategy.signals.B.status}): ${board.cf_strategy.signals.B.fires_when}`,
    "",
    `**Not this board:** ${board.cf_strategy.not_this_board}`,
    "",
    `Source extract: ${board.cf_strategy.source}`,
    "",
    "## Machine endpoints (prefer these)",
    "",
    `| Path | Purpose |`,
    `|---|---|`,
    `| GET /llms.txt | This guide |`,
    `| GET /api/board | Full board JSON (live + playbook + cf_strategy) |`,
    `| GET /api/board/status | Compact live status + cf_strategy summary |`,
    `| GET /api/board/moves | Playbook moves only |`,
    `| GET /api/board/moves?phase=truth&horizon=this_week&impact=critical | Filtered moves |`,
    `| GET /api/openapi.json | OpenAPI 3.1 for this service |`,
    `| GET /api/intel-health | Proxied intel.twzrd.xyz/health |`,
    "",
    "Query params on `/api/board` and `/api/board/moves`:",
    "- `phase` \u2014 truth | wedge | proof | distribution | convert",
    "- `horizon` \u2014 this_week | this_month | quarter",
    "- `impact` \u2014 critical | high | medium",
    "- `done` \u2014 comma-separated move ids to treat as completed (affects next_actions)",
    "",
    "## Next actions (highest leverage open)",
    ""
  ];
  for (const [i, m] of board.next_actions.entries()) {
    lines.push(
      `${i + 1}. **${m.id}** \u2014 ${m.title} (${m.impact}, ${m.horizon})`
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
  lines.push("- https://intel.twzrd.xyz/llms.txt \u2014 Agent Intel MCP / HTTP");
  lines.push("- https://intel.twzrd.xyz/mcp \u2014 Hosted MCP");
  lines.push("- https://intel.twzrd.xyz/health \u2014 Day0 counters");
  lines.push("- https://intel.twzrd.xyz/v1/intel/preflight \u2014 Pay decisions (product)");
  lines.push("- https://twzrd.xyz \u2014 Product front door");
  lines.push("- https://raw.githubusercontent.com/twzrd-sol/sprat-brief/main/sprat.json \u2014 SPRAT source extract");
  lines.push("");
  lines.push(
    "Agents: do not scrape the HTML UI. Use `/api/board` or `/api/board/status`."
  );
  lines.push("");
  return lines.join("\n");
}
function filterMoves(moves, q) {
  return moves.filter((m) => {
    if (q.phase && m.phase !== q.phase) return false;
    if (q.horizon && m.horizon !== q.horizon) return false;
    if (q.impact && m.impact !== q.impact) return false;
    return true;
  });
}
function parseDoneParam(raw) {
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}
function requestOrigin(request) {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedHost) {
    const proto = forwardedProto ?? "https";
    return `${proto}://${forwardedHost}`;
  }
  return url.origin;
}
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-allow-headers": "content-type, accept"
    }
  });
}
function textResponse(body, contentType, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "content-type": contentType,
      "cache-control": "no-store",
      "access-control-allow-origin": "*"
    }
  });
}
export {
  BOARD_ID,
  BOARD_VERSION,
  boardToLlmsTxt,
  buildBoardSnapshot,
  compactCfStrategy,
  filterMoves,
  jsonResponse,
  parseDoneParam,
  requestOrigin,
  textResponse
};
