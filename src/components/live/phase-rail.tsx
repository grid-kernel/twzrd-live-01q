import { PHASES, type PhaseId } from "@/lib/playbook";
import { cn } from "@/lib/cn";

type Props = {
  active: PhaseId | "all";
  onChange: (phase: PhaseId | "all") => void;
  doneByPhase: Record<PhaseId, { done: number; total: number }>;
};

export function PhaseRail({ active, onChange, doneByPhase }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <PhaseChip
        label="All phases"
        subtitle="Full board"
        active={active === "all"}
        onClick={() => onChange("all")}
      />
      {PHASES.map((p) => {
        const s = doneByPhase[p.id];
        return (
          <PhaseChip
            key={p.id}
            label={p.label}
            subtitle={
              s ? `${s.done}/${s.total} done · ${p.subtitle}` : p.subtitle
            }
            active={active === p.id}
            onClick={() => onChange(p.id)}
          />
        );
      })}
    </div>
  );
}

function PhaseChip({
  label,
  subtitle,
  active,
  onClick,
}: {
  label: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-w-[10.5rem] shrink-0 rounded-xl border px-3 py-2.5 text-left transition-colors",
        active
          ? "border-border-strong bg-surface-3 text-fg"
          : "border-border bg-surface text-muted hover:border-border-strong hover:bg-surface-2 hover:text-fg",
      )}
    >
      <span className="block text-xs font-semibold tracking-tight">{label}</span>
      <span className="mt-0.5 block text-[11px] leading-snug text-subtle">
        {subtitle}
      </span>
    </button>
  );
}
