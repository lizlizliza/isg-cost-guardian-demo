import { COST_BAR_COLORS, COST_BAR_LABELS } from "../../data/constants";

interface CostBuildUpBarProps {
  values: number[];
}

export default function CostBuildUpBar({ values }: CostBuildUpBarProps) {
  const total = values.reduce((s, v) => s + v, 0);
  if (total === 0) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm p-5">
        <div className="section-label">Cost Build-Up</div>
        <div className="h-6 bg-muted rounded-full" />
        <div className="text-xs text-muted-foreground mt-2">Adjust parameters to see cost breakdown</div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="section-label">Cost Build-Up</div>
      <div className="flex h-8 rounded-full overflow-hidden mb-3">
        {values.map((v, i) => {
          const pct = (v / total) * 100;
          if (pct < 0.5) return null;
          return (
            <div
              key={i}
              className="relative group transition-all duration-300 flex items-center justify-center"
              style={{ width: `${pct}%`, backgroundColor: COST_BAR_COLORS[i] }}
              title={`${COST_BAR_LABELS[i]}: $${v.toFixed(2)}`}
            >
              {pct >= 5 && (
                <span className="text-[10px] font-semibold text-white drop-shadow-sm pointer-events-none">
                  ${v.toFixed(2)}
                </span>
              )}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity" />
            </div>
          );
        })}
      </div>
      <div className="space-y-1.5">
        {values.map((v, i) => {
          const pct = ((v / total) * 100).toFixed(1);
          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COST_BAR_COLORS[i] }} />
              <span className="text-muted-foreground w-[130px]">{COST_BAR_LABELS[i]}</span>
              <span className="font-semibold text-foreground">${v.toFixed(2)}</span>
              <span className="text-muted-foreground ml-auto">{pct}%</span>
            </div>
          );
        })}
        <div className="flex items-center gap-2 text-xs pt-1.5 border-t border-border mt-1.5">
          <span className="w-[130px] text-muted-foreground" />
          <span className="font-bold text-foreground">Total</span>
          <span className="font-bold text-foreground">${total.toFixed(2)}</span>
          <span className="text-muted-foreground ml-auto">100%</span>
        </div>
      </div>
    </div>
  );
}
