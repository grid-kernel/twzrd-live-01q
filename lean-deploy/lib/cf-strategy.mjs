/** CF→Solana strategy block folded from SPRAT into Live Board. */
export const SPRAT_SOURCE_URLS = [
  "https://cdn.jsdelivr.net/gh/twzrd-sol/sprat-brief@main/sprat.json",
  "https://raw.githubusercontent.com/twzrd-sol/sprat-brief/main/sprat.json",
];
export const SPRAT_SOURCE_URL = SPRAT_SOURCE_URLS[1];

export const CF_STRATEGY_SCHEMA = "twzrd.cf_strategy/v1";

const EMBEDDED = {
  "schema": "twzrd.cf_strategy/v1",
  "source": "https://raw.githubusercontent.com/twzrd-sol/sprat-brief/main/sprat.json",
  "source_schema": "https://twzrd.xyz/schema/sprat-manifest/v1",
  "source_schema_version": "1.2.0",
  "source_role": "source_extract",
  "source_generated_at": "2026-08-11T22:18:31.000Z",
  "thesis": {
    "headline": "Own the rails that put every Cloudflare Agent on Solana.",
    "subcopy": "Cloudflare owns agent distribution. Solana owns settlement speed. SPRAT by TWZRD is the trust + x402 facilitator middle."
  },
  "decision": {
    "summary": "Hold engineering on Agents MCP SVM. Flood live x402-hono Solana path. MCP-SVM is watch + optional read-only spike only — not build-now.",
    "pick": "brief+hold",
    "ship_now": [
      "Workers + x402-hono + network:solana + https://intel.twzrd.xyz",
      "Public monorepo docs: examples/cloudflare-x402-seller README + CF_AGENTS_SOLANA.md (#1924/#1925/#1928)"
    ],
    "do_not": [
      "Re-probe Signal B weekly as if it is the product",
      "Build cloudflare/agents SVM fork this week without a go/no-go spike",
      "Claim generational moat or facilitator monopoly",
      "Treat paid MCP Solana as unblocked",
      "Reopen #596 as pure Solana enhancement without multi-scheme framing"
    ],
    "if_spike_later": {
      "type": "read_only",
      "return": [
        "Patch outline (ExactSvmScheme twin + type unions)",
        "Issue strategy: attach #1863 not reopen #596; check #1989 deprecation risk",
        "Gas cost model if MCP Solana hits TWZRD sponsor",
        "Explicit go / no-go / wait-for-Monetization-Gateway"
      ],
      "preferred_ship_shape_if_go": "Companion package first (usable without CF merge) + optional upstream PR sketch"
    },
    "github_agents_context": {
      "596": "closed NOT_PLANNED — pure Solana MCP enhancement rejected once",
      "793": "closed completed — v2 migrate; body mentioned future Solana; stopped at EVM",
      "1863": "open bug — docs claim multi-chain; code EVM-only; multi-scheme + type widen design (Stellar-focused but same hole)",
      "1989": "open — deprecating current x402 integration toward Monetization Gateway (raises merge risk for patches to mcp/x402.ts)"
    },
    "signal_b_probe_correction": {
      "scheme_package": "@x402/svm@2.21.0 (complete, not stub)",
      "register_api": "ExactSvmScheme class + registerExactSvmScheme on exact/server and exact/client (mirror EVM paths)",
      "grep_hint": "Prefer ExactSvmScheme or @x402/svm — not only registerExactSvmScheme function name",
      "fires_when": [
        "SVM scheme registered on BOTH server and client in agents MCP x402 module",
        "Solana appears in MCP network map / types",
        "agents changelog mentions Solana/SVM x402"
      ],
      "not_enough": [
        "TWZRD facilitator feePayers mainnet Solana (already true)",
        "More x402-hono docs",
        "Wallet API without MCP SVM"
      ]
    }
  },
  "agent": {
    "name": "SPRAT Agent",
    "codename": "sprat",
    "role": "Solana Payment Rails for Agent Traffic",
    "mission": "Convert Cloudflare agent demand into Solana settlement volume with TWZRD as the default trust + facilitator supplier.",
    "weapons": [
      "x402-hono Workers path (live, public workers.dev proof)",
      "Preflight reputation gate (live)",
      "Portable proof upsell funnel (live)",
      "Passive watch on MCP SVM + CF Wallets API — no speculative build"
    ]
  },
  "supply_lanes": [
    {
      "id": "workers-hono",
      "name": "Workers Solana sell",
      "status": "live",
      "detail": "x402-hono + TWZRD facilitator on mainnet USDC. Only Solana-capable CF surface today.",
      "product": "Immediate revenue path"
    },
    {
      "id": "preflight",
      "name": "Preflight intel gate",
      "status": "live",
      "detail": "Seller wallet reputation + price sanity.",
      "product": "intel.twzrd.xyz"
    },
    {
      "id": "portable-proof",
      "name": "Portable proof upsell (P5)",
      "status": "live",
      "detail": "Funnel measuring from clean zero.",
      "product": "Monetization layer"
    },
    {
      "id": "mcp-svm",
      "name": "Agents MCP @x402/svm",
      "status": "watch",
      "detail": "Agents MCP still EVM-only. Foundation @x402/svm exists; CF has not registered it. #1989 may replace mcp/x402.ts. No engineering this week.",
      "product": "Signal B — passive watch only"
    },
    {
      "id": "cf-wallets",
      "name": "Cloudflare Wallets API",
      "status": "watch",
      "detail": "Handle reservation live; Virtual Wallet API still coming.",
      "product": "Signal A — passive watch"
    },
    {
      "id": "token-policy",
      "name": "CF token mint policy",
      "status": "ready",
      "detail": "Per-job token policy ready. CF_WORKERS_DEPLOY_TOKEN separate from CF_API_TOKEN analytics.",
      "product": "Ops readiness"
    }
  ],
  "flow_steps": [
    {
      "id": "agent",
      "label": "CF Agent / Worker",
      "detail": "Agent requests a paid resource.",
      "side": "cf"
    },
    {
      "id": "challenge",
      "label": "HTTP 402 challenge",
      "detail": "network: solana, USDC amount.",
      "side": "cf"
    },
    {
      "id": "preflight",
      "label": "TWZRD preflight",
      "detail": "Seller wallet reputation + price sanity.",
      "side": "twzrd"
    },
    {
      "id": "sign",
      "label": "Solana sign",
      "detail": "SPL USDC transfer.",
      "side": "solana"
    },
    {
      "id": "settle",
      "label": "Facilitator settle",
      "detail": "TWZRD verifies + settles.",
      "side": "twzrd"
    },
    {
      "id": "serve",
      "label": "Resource delivered",
      "detail": "200 + Payment-Response.",
      "side": "cf"
    }
  ],
  "metrics": [
    {
      "label": "Facilitator path",
      "value": "Solana mainnet",
      "hint": "USDC exact"
    },
    {
      "label": "CF handle",
      "value": "twzrd.cloudflare.pay",
      "hint": "reserved"
    },
    {
      "label": "Live proof",
      "value": "x402-seller-hack-20260810.fp4b5ksccw.workers.dev",
      "hint": "ops-funded payer caveat"
    },
    {
      "label": "MCP SVM",
      "value": "not registered",
      "hint": "watch Signal B; #1989 deprecation risk"
    }
  ],
  "integration": {
    "network": "solana",
    "facilitator_url": "https://intel.twzrd.xyz",
    "snippet_language": "typescript",
    "surface": "x402-hono",
    "not_surface": "agents/x402 withX402 paidTool (EVM-only today)"
  },
  "signals": {
    "A": {
      "id": "cf-wallets-api",
      "label": "cf-wallets-api",
      "status": "watch",
      "fires_when": "Stable documentable Virtual Wallet API with create/list/fund ops.",
      "watch": "Stable Virtual Wallet API — no speculative CF Wallets scopes until then"
    },
    "B": {
      "id": "mcp-x402-svm",
      "label": "mcp-x402-svm",
      "status": "watch",
      "fires_when": "Agents MCP registers SVM scheme on both server and client; Solana in network map; changelog mentions Solana/SVM x402.",
      "probe": "https://raw.githubusercontent.com/cloudflare/agents/main/packages/agents/src/mcp/x402.ts",
      "probe_hint": "grep ExactSvmScheme or @x402/svm (scheme package is class-based, Foundation-complete at 2.21.0)",
      "related_issues": [
        "https://github.com/cloudflare/agents/issues/1863",
        "https://github.com/cloudflare/agents/issues/1989",
        "https://github.com/cloudflare/agents/issues/596"
      ],
      "watch": "registerExactSvm / @x402/svm on both sides; #1863 open, #596 NOT_PLANNED, #1989 deprecation risk"
    }
  },
  "posture": {
    "ship_now": [
      "workers-hono",
      "preflight",
      "portable-proof"
    ],
    "hold": [
      "mcp-svm",
      "cf-wallets"
    ],
    "ready_not_shipped": [
      "token-policy"
    ],
    "guardrail": "Flood Solana volume through live Workers + x402-hono + intel facilitator. Do not pre-build speculative CF Wallets scopes. Do not engineer Agents MCP SVM this week without an explicit spike go. Signal B is not product until CF registers SVM (or you ship a companion package after a written go/no-go)."
  },
  "company_sentence": "Scarcity for paying agents isn’t chain access — it’s a machine-readable *should I pay this?*, free at the top, enforced at the wallet hook, monetized as portable proof.",
  "not_this_board": "Pay decisions → https://intel.twzrd.xyz/v1/intel/preflight — never this board",
  "routing": {
    "cf_strategy": "This block (CF→Solana posture)",
    "execution": "Live Board next_actions / moves (Path B 0→1Q)",
    "product": "intel.twzrd.xyz (should I pay?)"
  },
  "sprat_mirror": {
    "self": "https://raw.githubusercontent.com/twzrd-sol/sprat-brief/main/sprat.json",
    "llms_txt": "https://raw.githubusercontent.com/twzrd-sol/sprat-brief/main/llms.txt",
    "agent_md": "https://raw.githubusercontent.com/twzrd-sol/sprat-brief/main/agent.md",
    "openapi": "https://raw.githubusercontent.com/twzrd-sol/sprat-brief/main/openapi.json",
    "lanes": "https://raw.githubusercontent.com/twzrd-sol/sprat-brief/main/lanes.json"
  },
  "external": {
    "intel_llms": "https://intel.twzrd.xyz/llms.txt",
    "facilitator": "https://intel.twzrd.xyz",
    "cloudflare_agents_x402": "https://raw.githubusercontent.com/cloudflare/agents/main/packages/agents/src/mcp/x402.ts",
    "example_readme": "https://github.com/twzrd-sol/wzrd-final/tree/main/examples/cloudflare-x402-seller",
    "live_worker": "https://x402-seller-hack-20260810.fp4b5ksccw.workers.dev/paid/hello"
  }
};

function mapSprat(sprat) {
  const d = sprat.decision_2026_08_11;
  const a = sprat.signals?.A;
  const b = sprat.signals?.B;
  return {
    schema: CF_STRATEGY_SCHEMA,
    source: SPRAT_SOURCE_URL,
    source_schema: sprat.schema,
    source_schema_version: sprat.schema_version ?? "unknown",
    source_role: sprat.role || sprat.provenance?.role || "source_extract",
    source_generated_at: sprat.generated_at,
    thesis: sprat.thesis ?? EMBEDDED.thesis,
    decision: {
      summary: d?.summary ?? EMBEDDED.decision.summary,
      pick: d?.pick ?? EMBEDDED.decision.pick,
      ship_now: d?.ship_now ?? EMBEDDED.decision.ship_now,
      do_not: d?.do_not ?? EMBEDDED.decision.do_not,
      if_spike_later: d?.if_spike_later ?? EMBEDDED.decision.if_spike_later,
      github_agents_context:
        d?.github_agents_context ?? EMBEDDED.decision.github_agents_context,
      signal_b_probe_correction:
        d?.signal_b_probe_correction ??
        EMBEDDED.decision.signal_b_probe_correction,
    },
    agent: sprat.agent ?? EMBEDDED.agent,
    supply_lanes: sprat.supply_lanes ?? EMBEDDED.supply_lanes,
    flow_steps: sprat.flow_steps ?? EMBEDDED.flow_steps,
    metrics: sprat.metrics ?? EMBEDDED.metrics,
    integration: sprat.integration ?? EMBEDDED.integration,
    signals: {
      A: {
        id: a?.id ?? EMBEDDED.signals.A.id,
        label: "cf-wallets-api",
        status: a?.status ?? EMBEDDED.signals.A.status,
        fires_when: a?.fires_when ?? EMBEDDED.signals.A.fires_when,
        watch: EMBEDDED.signals.A.watch,
      },
      B: {
        id: b?.id ?? EMBEDDED.signals.B.id,
        label: "mcp-x402-svm",
        status: b?.status ?? EMBEDDED.signals.B.status,
        fires_when: b?.fires_when ?? EMBEDDED.signals.B.fires_when,
        probe: b?.probe ?? EMBEDDED.signals.B.probe,
        probe_hint: b?.probe_hint ?? EMBEDDED.signals.B.probe_hint,
        related_issues: b?.related_issues ?? EMBEDDED.signals.B.related_issues,
        watch: EMBEDDED.signals.B.watch,
      },
    },
    posture: sprat.posture ?? EMBEDDED.posture,
    company_sentence: EMBEDDED.company_sentence,
    not_this_board: EMBEDDED.not_this_board,
    routing: EMBEDDED.routing,
    sprat_mirror: sprat.machine_endpoints ?? EMBEDDED.sprat_mirror,
    external: sprat.external ?? EMBEDDED.external,
  };
}

function mapSpratWithSource(sprat, url) {
  const mapped = mapSprat(sprat);
  mapped.source = url;
  mapped.source_role = sprat.role || sprat.provenance?.role || mapped.source_role || "source_extract";
  return mapped;
}

export async function loadCfStrategy() {
  const fetched_at = new Date().toISOString();
  for (const url of SPRAT_SOURCE_URLS) {
    try {
      const res = await fetch(url, {
        headers: { accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) continue;
      const sprat = await res.json();
      return { ...mapSpratWithSource(sprat, url), fetched_at, live_source: true };
    } catch {
      // try next
    }
  }
  return { ...EMBEDDED, fetched_at, live_source: false };
}

export function compactCfStrategy(cf) {
  return {
    schema: cf.schema,
    source_schema_version: cf.source_schema_version,
    source_role: cf.source_role,
    live_source: cf.live_source,
    pick: cf.decision.pick,
    thesis: cf.thesis.headline,
    decision_summary: cf.decision.summary,
    ship_now: cf.posture.ship_now,
    hold: cf.posture.hold,
    ready_not_shipped: cf.posture.ready_not_shipped,
    guardrail: cf.posture.guardrail,
    signals: {
      A: { id: cf.signals.A.id, status: cf.signals.A.status },
      B: { id: cf.signals.B.id, status: cf.signals.B.status },
    },
    not_this_board: cf.not_this_board,
  };
}
