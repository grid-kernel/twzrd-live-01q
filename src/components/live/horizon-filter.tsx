import type { Horizon } from "@/lib/playbook";
import { cn } from "@/lib/cn";

const OPTIONS: { id: Horizon | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "this_week", label: "This week" },
  { id: "this_month", label: "This month" },
  { id: "quarter", label: "Quarter" },
];

type Props = {
  value: Horizon | "all";
  onChange: (v: Horizon | "all") => void;
};

export function HorizonFilter({ value, onChange }: Props) {
  return (
    <div
      className="inline-flex rounded-lg border border-border bg-surface p-0.5"
      role="group"
      aria-label="Time horizon"
    >
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3",
            value === o.id
              ? "bg-surface-3 text-fg"
              : "text-muted hover:text-fg",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
