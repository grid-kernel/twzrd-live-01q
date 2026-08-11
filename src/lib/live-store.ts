import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOVES, impactWeight, type Horizon, type PhaseId } from "./playbook";

type LiveState = {
  done: Record<string, boolean>;
  notes: Record<string, string>;
  focusPhase: PhaseId | "all";
  focusHorizon: Horizon | "all";
  toggle: (id: string) => void;
  setNote: (id: string, note: string) => void;
  setFocusPhase: (phase: PhaseId | "all") => void;
  setFocusHorizon: (horizon: Horizon | "all") => void;
  resetProgress: () => void;
  score: () => { done: number; total: number; weighted: number; weightedMax: number; pct: number };
};

export const useLiveStore = create<LiveState>()(
  persist(
    (set, get) => ({
      done: {},
      notes: {},
      focusPhase: "all",
      focusHorizon: "all",
      toggle: (id) =>
        set((s) => ({
          done: { ...s.done, [id]: !s.done[id] },
        })),
      setNote: (id, note) =>
        set((s) => ({
          notes: { ...s.notes, [id]: note },
        })),
      setFocusPhase: (focusPhase) => set({ focusPhase }),
      setFocusHorizon: (focusHorizon) => set({ focusHorizon }),
      resetProgress: () => set({ done: {}, notes: {} }),
      score: () => {
        const { done } = get();
        let weighted = 0;
        let weightedMax = 0;
        let doneCount = 0;
        for (const m of MOVES) {
          const w = impactWeight(m.impact);
          weightedMax += w;
          if (done[m.id]) {
            weighted += w;
            doneCount += 1;
          }
        }
        const total = MOVES.length;
        const pct = weightedMax === 0 ? 0 : Math.round((weighted / weightedMax) * 100);
        return { done: doneCount, total, weighted, weightedMax, pct };
      },
    }),
    { name: "twzrd-live-0-1q-v1" },
  ),
);
