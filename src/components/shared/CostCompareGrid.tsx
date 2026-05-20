import { COST_BAR_COLORS } from "../../data/constants";

interface CostCompareGridProps {
  values: number[];
  baseline?: number[];
}

const DISPLAY_GROUPS = [
  { label: "Material", idx: 0 },
  { label: "Conversion", idx: 1 },
  { label: "Logistics + Tariff", idx: 3 },
  { label: "Adders", idx: 4 },
];

export default function CostCompareGrid({ values, baseline }: CostCompareGridProps) {
  const total = values.reduce((s, v) => s + v, 0);

  return (
    <div className="grid grid-cols-2 gap-3">
      {DISPLAY_GROUPS.map((group) => {
        const val = values[group.idx] ?? 0;
        const base = baseline ? baseline[group.idx] ?? 0 : 0;
        const delta = val - base;
        const pct = total > 0 ? (val / total) * 100 : 0;
        const color = COST_BAR_COLORS[group.idx];

        return (
          <div key={group.label} className="bg-card rounded-xl border border-border shadow-sm p-4">
            <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{group.label}</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-foreground">${val.toFixed(2)}</span>
              {baseline && (
                <span className={`text-xs font-medium ${delta >= 0 ? 'text-destructive' : 'text-emerald-600'}`}>
                  {delta >= 0 ? '+' : ''}${delta.toFixed(2)}
                </span>
              )}
            </div>
            <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">{pct.toFixed(0)}% of total</div>
          </div>
        );
      })}
    </div>
  );
}
