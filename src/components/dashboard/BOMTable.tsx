import type { Program } from "../../types";

interface BOMTableProps {
  program: Program;
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    OK: "bg-emerald-100 text-emerald-700",
    "At Risk": "bg-amber-100 text-amber-700",
    Blocked: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${colorMap[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

export default function BOMTable({ program }: BOMTableProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="section-label mb-0">BOM Components</div>
        <span className="text-[10px] text-muted-foreground">
          {program.quotedCount}/{program.totalComponents} quoted
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-2 font-semibold">Component</th>
              <th className="text-left py-2 px-2 font-semibold">Category</th>
              <th className="text-right py-2 px-2 font-semibold">DCE</th>
              <th className="text-right py-2 px-2 font-semibold">Quote</th>
              <th className="text-right py-2 px-2 font-semibold">Var.</th>
              <th className="text-right py-2 px-2 font-semibold">Ch. 1</th>
              <th className="text-right py-2 px-2 font-semibold">Ch. 2</th>
              <th className="text-center py-2 px-2 font-semibold">Mat.</th>
              <th className="text-center py-2 px-2 font-semibold">Status</th>
              <th className="text-left py-2 pl-2 font-semibold">AI Insight</th>
            </tr>
          </thead>
          <tbody>
            {program.bomComponents.map((comp) => {
              const variance = comp.quoteVariance ?? 0;
              const variancePct = comp.quoteVariancePct ?? 0;
              return (
                <tr key={comp.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                  <td className="py-2 pr-2 font-medium text-foreground">{comp.name}</td>
                  <td className="py-2 px-2 text-muted-foreground">{comp.category}</td>
                  <td className="py-2 px-2 text-right font-medium">${comp.dce}</td>
                  <td className="py-2 px-2 text-right font-medium">
                    {comp.preferredQuote ? `$${comp.preferredQuote}` : "—"}
                  </td>
                  <td className={`py-2 px-2 text-right font-medium ${variance > 0 ? "text-destructive" : "text-emerald-600"}`}>
                    {variance > 0 ? "+" : ""}{variancePct.toFixed(1)}%
                  </td>
                  <td className="py-2 px-2 text-right text-muted-foreground">${comp.challenger1}</td>
                  <td className="py-2 px-2 text-right text-muted-foreground">${comp.challenger2}</td>
                  <td className="py-2 px-2 text-center">
                    <div className="flex items-center justify-center">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full mx-[1px] ${
                            i <= comp.costMaturity ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <StatusBadge status={comp.status} />
                  </td>
                  <td className="py-2 pl-2 text-muted-foreground italic max-w-[180px] truncate">
                    {comp.aiInsight}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
