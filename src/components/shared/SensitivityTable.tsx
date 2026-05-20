import type { SensitivityItem } from "../../types";

interface SensitivityTableProps {
  items: SensitivityItem[];
}

export default function SensitivityTable({ items }: SensitivityTableProps) {
  const maxAbs = Math.max(...items.map((i) => Math.max(Math.abs(i.negImpact), Math.abs(i.posImpact))), 0.01);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="section-label">Sensitivity Analysis</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Parameter</th>
              <th className="text-right py-2 px-3 font-semibold text-destructive">-10%</th>
              <th className="py-2 px-2 w-40" />
              <th className="text-left py-2 px-3 font-semibold text-emerald-600">+10%</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const negBar = (Math.abs(item.negImpact) / maxAbs) * 100;
              const posBar = (Math.abs(item.posImpact) / maxAbs) * 100;
              return (
                <tr key={item.variable} className="border-b border-border/50 last:border-0">
                  <td className="py-2 pr-4 font-medium text-foreground">{item.variable}</td>
                  <td className="text-right py-2 px-3 text-destructive font-medium">
                    {item.negImpact >= 0 ? "+" : ""}${item.negImpact.toFixed(2)}
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-0.5 h-5">
                      {item.negImpact < 0 && (
                        <div
                          className="h-1.5 bg-destructive/70 rounded-l-full"
                          style={{ width: `${negBar}%`, minWidth: "2px" }}
                        />
                      )}
                      <div className="flex-1 min-w-[4px]" />
                      {item.posImpact > 0 && (
                        <div
                          className="h-1.5 bg-emerald-500/70 rounded-r-full"
                          style={{ width: `${posBar}%`, minWidth: "2px" }}
                        />
                      )}
                    </div>
                  </td>
                  <td className="text-left py-2 px-3 text-emerald-600 font-medium">
                    {item.posImpact >= 0 ? "+" : ""}${item.posImpact.toFixed(2)}
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
