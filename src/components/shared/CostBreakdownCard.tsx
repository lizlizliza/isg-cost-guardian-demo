import type { CostBreakdown, Commodity } from "../../types";

interface CostBreakdownCardProps {
  breakdown: CostBreakdown;
  commodity: Commodity;
}

export default function CostBreakdownCard({ breakdown, commodity }: CostBreakdownCardProps) {
  const vsPriorGen = breakdown.shouldCost - commodity.priorGenDCE;
  const vsQuote = breakdown.shouldCost - commodity.supplierQuote;
  const vsPriorGenPct = ((vsPriorGen / commodity.priorGenDCE) * 100).toFixed(1);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="bg-background px-5 py-3 border-b border-border">
        <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
          Should Cost &mdash; DCE Output
        </div>
        <div className="text-xs text-muted-foreground/70 mt-0.5">
          ThinkSystem SR650 V4 &middot; {commodity.name} &middot; {commodity.partNo}
        </div>
      </div>
      <div className="px-5 py-4 bg-card">
        <div className="text-4xl font-bold text-foreground transition-all duration-400">
          ${breakdown.shouldCost.toFixed(2)}{' '}
          <span className="text-sm font-normal text-muted-foreground">/ unit</span>
        </div>
      </div>
      <div className="px-5 py-3 bg-card flex flex-wrap gap-x-6 gap-y-1 text-xs">
        <span>
          vs. Prior Gen DCE: ${commodity.priorGenDCE.toFixed(2)}{' '}
          <span className={vsPriorGen > 0 ? 'text-warning font-medium' : 'text-emerald-600 font-medium'}>
            {vsPriorGen > 0 ? '▲' : '▼'} {vsPriorGen > 0 ? '+' : ''}{vsPriorGenPct}%
          </span>
        </span>
        <span>
          vs. Supplier Quote: ${commodity.supplierQuote.toFixed(2)}{' '}
          <span className={vsQuote < 0 ? 'text-emerald-600 font-medium' : 'text-destructive font-medium'}>
            Gap: {vsQuote < 0 ? '' : '+'}${vsQuote.toFixed(2)}
          </span>
        </span>
      </div>
    </div>
  );
}
