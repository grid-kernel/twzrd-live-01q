/** Path B External Integration Runbook — refuse-before-sign for external operators. */

export const PATH_B_SCHEMA = "twzrd.path_b_runbook/v1" as const;
export const PATH_B_VERSION = "1.0.0";

export type PathBStep = {
  id: string;
  n: number;
  title: string;
  duration: string;
  operator: string;
  detail: string;
  commands?: string[];
  expected?: string[];
  pitfalls?: string[];
};

export type EvidenceItem = {
  id: string;
  decision: "BLOCK" | "ALLOW" | "BOTH";
  title: string;
  capture: string;
  pass_if: string;
  fail_if: string;
};

export type PartnerSeat = {
  order: number;
  codename: string;
  role: string;
  why_this_order: string;
  session_goal: string;
  success: string;
  do_not: string;
};

export type PathBRunbook = {
  schema: typeof PATH_B_SCHEMA;
  version: string;
  generated_at: string;
  title: string;
  claim: string;
  why_first: string;
  not_this_runbook: string;
  north_star: string;
  install: {
    package: string;
    package_version: string;
    npm: string;
    cold_machine_cmd: string;
    expected_refuse: string;
    links: { label: string; href: string }[];
  };
  steps: PathBStep[];
  evidence: EvidenceItem[];
  partner_sequence: PartnerSeat[];
  artifact: {
    title: string;
    required_fields: string[];
    example_shape: Record<string, unknown>;
    publish_rule: string;
  };
  session_script: {
    title: string;
    minutes: Array<{ t: string; say: string; show: string }>;
  };
  funnel_instrumentation: Array<{
    stage: string;
    metric: string;
    where: string;
  }>;
  order_of_ops: string[];
  endpoints?: Record<string, string>;
};

const COLD_CMD = `npm i twzrd-x402-gate@0.8.14 x402-solana@2.1.0 @x402/core @x402/fetch @x402/svm @solana/kit @scure/base
node node_modules/twzrd-x402-gate/bin/twzrd-gate-eval-refuse.js`;

export function buildPathBRunbook(opts?: {
  origin?: string;
  generated_at?: string;
}): PathBRunbook {
  const origin = (opts?.origin ?? "").replace(/\/$/, "");
  const generated_at = opts?.generated_at ?? new Date().toISOString();

  return {
    schema: PATH_B_SCHEMA,
    version: PATH_B_VERSION,
    generated_at,
    title: "Path B External Integration Runbook",
    claim:
      "Externally controlled refuse-before-sign: a buyer pipeline that is not ours evaluates and can BLOCK payment before any Solana signer runs.",
    why_first:
      "Distribution without external gate_evals is amplification of supply. Path B is the only missing proof. Founder posts wait until one attributable external artifact exists.",
    not_this_runbook:
      "Pay decisions → https://intel.twzrd.xyz/v1/intel/preflight. This runbook installs enforcement; it does not authorize spend. Free preflight ≠ product.",
    north_star:
      "Success = external gate_evals with signer_invocation_count=0 on refuse (and attributable lineage on the Live Board).",
    install: {
      package: "twzrd-x402-gate",
      package_version: "0.8.14",
      npm: "https://www.npmjs.com/package/twzrd-x402-gate",
      cold_machine_cmd: COLD_CMD,
      expected_refuse: "signer_invocation_count=0 payment_retry_count=0",
      links: [
        {
          label: "Refuse fixture",
          href: "https://intel.twzrd.xyz/v1/intel/refuse-fixture",
        },
        { label: "Intel llms.txt", href: "https://intel.twzrd.xyz/llms.txt" },
        { label: "Intel health", href: "https://intel.twzrd.xyz/health" },
        {
          label: "Preflight (pay decision)",
          href: "https://intel.twzrd.xyz/v1/intel/preflight",
        },
      ],
    },
    steps: [
      {
        id: "prep",
        n: 1,
        title: "Prep the seat (before screen-share)",
        duration: "5 min",
        operator: "You (TWZRD)",
        detail:
          "Confirm intel health is green. Open Live Board funnel. Do not lead with MCP catalog or CF strategy. Hero line only: before your agent signs, TWZRD can refuse.",
        expected: [
          "intel.twzrd.xyz/health returns ok",
          "gate_evals baseline noted (usually 0 external)",
          "Partner machine has Node 20+ and network egress",
        ],
        pitfalls: [
          "Do not open with free-card volume or internal swarm hits",
          "Do not demo V6 paid proof before refuse",
        ],
      },
      {
        id: "cold-refuse",
        n: 2,
        title: "Cold-machine refuse proof (their shell)",
        duration: "3–5 min",
        operator: "Partner shares terminal",
        detail:
          "They paste the install one-liner and run the refuse eval binary. No wallet. No USDC. Goal is a clean refuse before any signer invocation.",
        commands: [COLD_CMD],
        expected: [
          "Process exits with signer_invocation_count=0",
          "payment_retry_count=0",
          "Transcript / JSON includes a BLOCK (or refuse) decision path",
        ],
        pitfalls: [
          "If peer deps fail, stop and fix as P0 — do not hand-wave past install friction",
          "Never run this only on a TWZRD laptop and call it external",
        ],
      },
      {
        id: "wire-hook",
        n: 3,
        title: "Wire gate into their buyer pipeline",
        duration: "10–15 min",
        operator: "Partner + you",
        detail:
          "Install onBeforePayment / fetch wrapper so every payment attempt hits preflight + gate before signTransaction. Shadow mode is allowed for first session; enforce is the goal for the artifact.",
        commands: [
          `// Pseudocode — place before any signTransaction
import { createTwzrdGate } from "twzrd-x402-gate"; // or package entry from README

const gate = createTwzrdGate({
  intelBase: "https://intel.twzrd.xyz",
  mode: "enforce", // or "shadow" for 14-day white-glove
});

async function onBeforePayment(intent) {
  const decision = await gate.evaluate(intent);
  // Log: decision, payer lineage, merchant, amount, ts
  if (decision.action === "BLOCK") {
    throw new Error("TWZRD_GATE_BLOCK: " + decision.reason);
  }
  return decision; // ALLOW → proceed to sign
}`,
        ],
        expected: [
          "Every payment attempt calls evaluate before sign",
          "BLOCK throws / aborts without touching signer",
          "ALLOW continues to existing sign path unchanged",
        ],
        pitfalls: [
          "Hook after sign is not Path B",
          "Silent fail-open without logging is not evidence",
        ],
      },
      {
        id: "evidence",
        n: 4,
        title: "Run BLOCK + ALLOW evidence capture",
        duration: "10 min",
        operator: "Partner",
        detail:
          "Two forced paths: (1) refuse fixture / known-bad merchant → BLOCK with signer=0; (2) known-good allow path → ALLOW with normal sign. Capture both using the checklist below.",
        expected: [
          "BLOCK transcript with signer_invocation_count=0",
          "ALLOW path still works (gate is not a permanent outage)",
          "Logs include attributable payer / install seat id",
        ],
      },
      {
        id: "lineage",
        n: 5,
        title: "Confirm Live Board / health lineage",
        duration: "5 min",
        operator: "You",
        detail:
          "Refresh intel /health and Live Board funnel. External gate_evals should move (or at least a design-partner install is logged with a timestamped artifact if counter lag exists). Document counter snapshot before/after.",
        expected: [
          "gate_evals delta noted or explicit lag note with artifact file",
          "Artifact stored with partner codename + date (no secrets)",
        ],
      },
      {
        id: "handoff",
        n: 6,
        title: "Lock next seat + founder-post gate",
        duration: "5 min",
        operator: "You",
        detail:
          "Sequence is locked: Vicky → Nick → Lucas. Do not expand the 10-target list until one external artifact exists. Founder post only after step 5 artifact is real.",
        expected: [
          "Next partner on the locked sequence scheduled",
          "Artifact file path / gist / transcript linked on board notes",
        ],
      },
    ],
    evidence: [
      {
        id: "e-block-signer",
        decision: "BLOCK",
        title: "Refuse before sign",
        capture:
          "Full refuse eval stdout or gate evaluate() JSON for a forced BLOCK path (refuse fixture / known-bad merchant).",
        pass_if:
          "signer_invocation_count=0 AND payment_retry_count=0 AND decision=BLOCK (or equivalent refuse action).",
        fail_if:
          "Any signer call, any payment retry, or missing decision field.",
      },
      {
        id: "e-block-reason",
        decision: "BLOCK",
        title: "Machine-readable reason",
        capture: "decision.reason / code / rule id from gate output.",
        pass_if: "Stable string or code a partner can grep in logs.",
        fail_if: "Opaque HTML or no reason on BLOCK.",
      },
      {
        id: "e-allow",
        decision: "ALLOW",
        title: "Happy path still pays",
        capture:
          "One ALLOW evaluate() result on a known-good intent (sandbox or mainnet as agreed).",
        pass_if: "decision=ALLOW and existing sign path proceeds once.",
        fail_if: "ALLOW path broken or always-BLOCK false positive on good merchant.",
      },
      {
        id: "e-preflight-log",
        decision: "BOTH",
        title: "Preflight logged",
        capture:
          "Log line showing free preflight (ReadinessCard / preflight id) before evaluate completes.",
        pass_if: "Preflight id or card hash present in session log for both paths.",
        fail_if: "Gate runs without intel preflight when product requires it.",
      },
      {
        id: "e-lineage",
        decision: "BOTH",
        title: "Attributable payer lineage",
        capture:
          "Install seat id / partner codename / agent id + timestamp. Not a TWZRD-owned laptop alone.",
        pass_if:
          "External operator identity is explicit; can be tied to funnel stage gate_evals.",
        fail_if: "Anonymous or internal-only run counted as external.",
      },
      {
        id: "e-board",
        decision: "BOTH",
        title: "Live Board snapshot",
        capture:
          "Before/after /api/intel-health or /health day0: gate_evals, gate_blocks, free_card_hits_external.",
        pass_if:
          "Numbers recorded; if lag, artifact still filed with timestamp and follow-up check.",
        fail_if: "No metric snapshot and no artifact file.",
      },
    ],
    partner_sequence: [
      {
        order: 1,
        codename: "Vicky",
        role: "First external seat — design partner operator",
        why_this_order:
          "Locked sequence. First attributable refuse must come from a real external control plane, not a list blast.",
        session_goal:
          "Complete cold refuse + wire hook in shadow or enforce; capture BLOCK artifact.",
        success:
          "Artifact filed; gate_evals lineage path understood; white-glove notes for install friction.",
        do_not: "Do not skip to Nick until Vicky session is complete or explicitly rescheduled.",
      },
      {
        order: 2,
        codename: "Nick",
        role: "Second external seat — buyer pipeline integration",
        why_this_order:
          "Second seat validates the runbook is repeatable after Vicky fixes.",
        session_goal:
          "Partner runs refuse binary themselves; at least one BLOCK with signer=0 on their stack.",
        success: "Second artifact; runbook edits if friction differs from Vicky.",
        do_not: "Do not open multi-target outbound in parallel.",
      },
      {
        order: 3,
        codename: "Lucas",
        role: "Third external seat — framework / embed adjacency",
        why_this_order:
          "Third seat is the credibility threshold for a founder post with external proof, not enrollment theater.",
        session_goal:
          "Install path stable enough to reference publicly; optional embed docs next.",
        success:
          "≥1 public-safe sanitized transcript; gate_evals story is external, not internal swarm.",
        do_not: "Do not launch distribution package until this seat (or clear Vicky+Nick artifacts) unlocks the claim.",
      },
    ],
    artifact: {
      title: "Attributable external Path B artifact",
      required_fields: [
        "partner_codename",
        "date_iso",
        "machine_note (external, not TWZRD laptop)",
        "gate_package_version",
        "block_transcript (signer_invocation_count, payment_retry_count, decision)",
        "allow_transcript_or_note",
        "health_snapshot_before",
        "health_snapshot_after",
        "operator_friction_notes",
      ],
      example_shape: {
        schema: "twzrd.path_b_artifact/v1",
        partner_codename: "Vicky",
        date_iso: "2026-08-12",
        machine_note: "partner macbook — external",
        gate_package_version: "0.8.14",
        block: {
          decision: "BLOCK",
          signer_invocation_count: 0,
          payment_retry_count: 0,
          reason: "…",
        },
        allow: { decision: "ALLOW", note: "known-good merchant path" },
        health_before: { gate_evals: 0, gate_blocks: 0 },
        health_after: { gate_evals: 1, gate_blocks: 1 },
        friction: [],
      },
      publish_rule:
        "Founder recap / announcement only after at least one external artifact exists. Enrollment-without-artifact is not the post.",
    },
    session_script: {
      title: "Screen-share script (~30 min)",
      minutes: [
        {
          t: "0:00",
          say: "Before your agent signs, TWZRD can refuse. That is the only demo that matters today.",
          show: "Live Board north star + funnel (external columns only)",
        },
        {
          t: "0:03",
          say: "No wallet. No USDC. You run this on your machine.",
          show: "Cold install one-liner — partner pastes",
        },
        {
          t: "0:08",
          say: "signer_invocation_count must be zero. That is refuse-before-sign.",
          show: "Their terminal output",
        },
        {
          t: "0:12",
          say: "Now we put the same evaluate call before your signTransaction.",
          show: "Their buyer pipeline entrypoint",
        },
        {
          t: "0:22",
          say: "Force a BLOCK, then an ALLOW. We capture both.",
          show: "Evidence checklist on this page",
        },
        {
          t: "0:28",
          say: "We file the artifact. Next seat is locked — not a spray list.",
          show: "Partner sequence + health snapshot",
        },
      ],
    },
    funnel_instrumentation: [
      {
        stage: "External free cards",
        metric: "free_card_hits_external",
        where: "intel /health day0 + Live Board funnel",
      },
      {
        stage: "Gate evals (Path B)",
        metric: "gate_evals",
        where: "intel /health day0 — primary wedge counter",
      },
      {
        stage: "Gate blocks",
        metric: "gate_blocks",
        where: "intel /health day0 — refuse outcomes",
      },
      {
        stage: "Paid trust external",
        metric: "paid_trust_payer_external",
        where: "Secondary — do not optimize before gate_evals move",
      },
    ],
    order_of_ops: [
      "1. Produce this runbook (screen-share ready)",
      "2. Define BLOCK/ALLOW evidence-capture checklist",
      "3. Run with Vicky, then Nick, then Lucas",
      "4. Capture one attributable external artifact",
      "5. Launch founder post with external proof — not enrollment theater",
    ],
    endpoints: origin
      ? {
          human_runbook: `${origin}/path-b`,
          machine_json: `${origin}/api/path-b`,
          board: `${origin}/api/board`,
          llms: `${origin}/llms.txt`,
          intel_health: `${origin}/api/intel-health`,
        }
      : {
          human_runbook: "/path-b",
          machine_json: "/api/path-b",
          board: "/api/board",
          llms: "/llms.txt",
          intel_health: "/api/intel-health",
        },
  };
}

export function pathBToMarkdown(rb: PathBRunbook): string {
  const lines: string[] = [
    `# ${rb.title}`,
    "",
    `schema: ${rb.schema} · version ${rb.version}`,
    `generated_at: ${rb.generated_at}`,
    "",
    `**Claim:** ${rb.claim}`,
    "",
    `**Why first:** ${rb.why_first}`,
    "",
    `**North star:** ${rb.north_star}`,
    "",
    `**Not this runbook:** ${rb.not_this_runbook}`,
    "",
    "## Order of ops",
    "",
  ];
  for (const o of rb.order_of_ops) lines.push(`- ${o}`);
  lines.push("", "## Install (cold machine)", "");
  lines.push("```bash");
  lines.push(rb.install.cold_machine_cmd);
  lines.push("```");
  lines.push(`Expected: \`${rb.install.expected_refuse}\``);
  lines.push("", "## Screen-share steps", "");
  for (const s of rb.steps) {
    lines.push(`### ${s.n}. ${s.title} (${s.duration})`);
    lines.push(`Operator: ${s.operator}`);
    lines.push("");
    lines.push(s.detail);
    if (s.commands?.length) {
      lines.push("", "```");
      lines.push(...s.commands);
      lines.push("```");
    }
    if (s.expected?.length) {
      lines.push("", "Expected:");
      for (const e of s.expected) lines.push(`- ${e}`);
    }
    if (s.pitfalls?.length) {
      lines.push("", "Pitfalls:");
      for (const p of s.pitfalls) lines.push(`- ${p}`);
    }
    lines.push("");
  }
  lines.push("## Evidence checklist (BLOCK / ALLOW)", "");
  lines.push("| ID | Decision | Capture | Pass if |");
  lines.push("|---|---|---|---|");
  for (const e of rb.evidence) {
    lines.push(
      `| ${e.id} | ${e.decision} | ${e.title}: ${e.capture} | ${e.pass_if} |`,
    );
  }
  lines.push("", "## Partner sequence (locked)", "");
  for (const p of rb.partner_sequence) {
    lines.push(
      `${p.order}. **${p.codename}** — ${p.role}. Goal: ${p.session_goal}. Success: ${p.success}`,
    );
  }
  lines.push("", "## Artifact", "");
  lines.push(rb.artifact.publish_rule);
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(rb.artifact.example_shape, null, 2));
  lines.push("```");
  lines.push("");
  return lines.join("\n");
}
