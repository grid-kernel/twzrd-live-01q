export type Day0 = {
  free_card_hits?: number;
  free_card_hits_internal?: number;
  free_card_hits_external?: number;
  free_card_hits_unattributed?: number;
  paid_trust_total?: number;
  paid_trust_payer_external?: number;
  paid_trust_payer_internal?: number;
  paid_trust_payer_unknown?: number;
  gate_evals?: number;
  gate_blocks?: number;
  gate_allows?: number;
  gate_shadow_blocks?: number;
  gate_fail_open?: number;
  receipt_verifies?: number;
  receipt_verify_valid?: number;
  receipt_verify_invalid?: number;
  portable_proof_upsell_shown_external?: number;
  door_requests?: number;
  door_anon?: number;
  door_proven?: number;
};

export type HealthPayload = {
  status?: string;
  mode?: string;
  package_version?: string;
  network?: string;
  settle_gate_enabled?: boolean;
  settle_gate_shadow?: boolean;
  settle_gate_enforcing?: boolean;
  settle_gate_threshold?: number;
  self_facilitate?: boolean;
  agent_intel_enabled?: boolean;
  day0?: Day0;
  service_catalog?: {
    service_count?: number;
    live_402_service_count?: number;
    covered_paytos?: number;
  };
};

export type LiveSnapshot = {
  fetchedAt: string;
  ok: boolean;
  error?: string;
  health?: HealthPayload;
};

export function deriveFunnel(day0?: Day0) {
  return {
    external_cards: day0?.free_card_hits_external ?? 0,
    gate_evals: day0?.gate_evals ?? 0,
    gate_blocks: day0?.gate_blocks ?? 0,
    paid_external: day0?.paid_trust_payer_external ?? 0,
  };
}

export type StageStatus = "empty" | "thin" | "moving" | "healthy";

export function stageStatus(key: keyof ReturnType<typeof deriveFunnel>, value: number): StageStatus {
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
  // paid
  if (value <= 0) return "empty";
  if (value < 5) return "thin";
  if (value < 50) return "moving";
  return "healthy";
}

export function liveDiagnosis(funnel: ReturnType<typeof deriveFunnel>, day0?: Day0): string {
  const internal = day0?.free_card_hits_internal ?? 0;
  if (funnel.gate_evals === 0 && funnel.external_cards === 0) {
    return "Infra is live; demand is not. Zero external free cards and zero gate_evals — Path B has no external seat yet.";
  }
  if (funnel.gate_evals === 0 && funnel.external_cards > 0) {
    return "Advisory demand exists without enforcement. Free cards are happening; nobody has installed the buyer gate. Lead with refuse-before-sign.";
  }
  if (funnel.gate_evals > 0 && funnel.paid_external === 0) {
    return "Path B is moving. Next: design partners and optional V6 as portable proof — do not confuse receipts with enforcement.";
  }
  if (internal > funnel.external_cards * 10) {
    return "Internal swarm dominates free cards. Treat only free_card_hits_external and external payers as demand.";
  }
  return "Funnel has signal. Keep Path B primary; grow embed seats and design partners.";
}
