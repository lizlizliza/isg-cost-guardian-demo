import { useMemo, useState } from "react";
import { useData } from "../../context/DataContext";
import CostWaterfall from "./CostWaterfall";
import VarianceDriversTable from "./VarianceDriversTable";

export default function VarianceWaterfall() {
  const { dashboard, bom, platform } = useData();
  const [viewMode, setViewMode] = useState<"full" | "l2">("full");

  const platformDash = useMemo(
    () => dashboard.filter((d) => d.platform === platform),
    [dashboard, platform]
  );
  const platformBom = useMemo(
    () => bom.filter((b) => b.platform === platform),
    [bom, platform]
  );

  const aci = useMemo(() => {
    const r = platformDash.find((d) => d.kpiType === "ACI");
    if (r && typeof r.value === "number") return r.value as number;
    const fallback = platformDash.find((d) => d.kpiType === "ACI_Index");
    if (fallback && typeof fallback.value === "number") return (fallback.value as number) * 700;
    return 0;
  }, [platformDash]);

  const dce = useMemo(() => {
    const r = platformDash.find((d) => d.kpiType === "DCE");
    return r && typeof r.value === "number" ? r.value as number : 0;
  }, [platformDash]);

  const cce = useMemo(() => {
    const r = platformDash.find((d) => d.kpiType === "CCE");
    return r && typeof r.value === "number" ? r.value as number : 0;
  }, [platformDash]);

  const aciToDceGap = aci > 0 ? (dce - aci) : 0;
  const dceToCceGap = dce > 0 ? (dce - cce) : 0;
  const aciToDcePct = aci > 0 ? ((aciToDceGap / aci) * 100) : 0;
  const dceToCcePct = cce > 0 ? ((dceToCceGap / cce) * 100) : 0;

  const totalDceGap = platformBom.reduce((sum, b) => {
    const gap = (b.quote ?? b.dce) - b.dce;
    return sum + gap;
  }, 0);

  return (
    <div className="fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Variance Waterfall</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Cost bridge analysis from ACI through DCE to CCE — {platform}
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-1 bg-secondary rounded-lg p-1 w-fit">
        <button
          onClick={() => setViewMode("full")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
            viewMode === "full"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Full Box View
        </button>
        <button
          onClick={() => setViewMode("l2")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
            viewMode === "l2"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          L2 Component View
        </button>
      </div>

      {viewMode === "full" ? (
        <>
          {/* Gap Summary */}
          <div className="flex items-center gap-6 text-xs bg-card rounded-xl border border-border shadow-sm px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">ACI → DCE:</span>
              <span className="font-bold text-destructive">+${aciToDceGap.toFixed(0)}</span>
              <span className="text-muted-foreground">({aciToDcePct.toFixed(1)}%)</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">DCE → CCE:</span>
              <span className="font-bold text-destructive">+${dceToCceGap.toFixed(0)}</span>
              <span className="text-muted-foreground">({dceToCcePct.toFixed(1)}%)</span>
            </div>
          </div>

          <CostWaterfall platform={platform} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VarianceDriversTable bridge="ACI→DCE" />
            <VarianceDriversTable bridge="DCE→CCE" />
          </div>
        </>
      ) : (
        <>
          {/* L2 Component View — per-component cost waterfall */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-5">
            <div className="section-label">L2 Component Cost Gap — {platform}</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 pr-3 font-semibold">Component</th>
                    <th className="text-right py-2 px-3 font-semibold">DCE</th>
                    <th className="text-right py-2 px-3 font-semibold">Quote</th>
                    <th className="text-right py-2 px-3 font-semibold">Gap</th>
                    <th className="text-right py-2 pl-3 font-semibold">Gap %</th>
                    <th className="text-left py-2 pl-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {platformBom.map((b) => {
                    const gap = (b.quote ?? b.dce) - b.dce;
                    const gapPct = b.dce > 0 ? ((gap / b.dce) * 100) : 0;
                    return (
                      <tr key={b.component} className="border-b border-border/50 last:border-0">
                        <td className="py-2 pr-3 font-medium text-foreground">{b.component}</td>
                        <td className="py-2 px-3 text-right">${b.dce}</td>
                        <td className="py-2 px-3 text-right">{b.quote != null ? `$${b.quote}` : "—"}</td>
                        <td className={`py-2 px-3 text-right font-semibold ${gap > 0 ? "text-destructive" : "text-emerald-600"}`}>
                          {gap > 0 ? "+" : ""}${gap}
                        </td>
                        <td className={`py-2 pl-3 text-right ${gapPct > 0 ? "text-destructive" : "text-emerald-600"}`}>
                          {gapPct > 0 ? "+" : ""}{gapPct.toFixed(1)}%
                        </td>
                        <td className="py-2 pl-3">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            b.status === "Blocked" ? "bg-red-100 text-red-700" :
                            b.status === "At Risk" ? "bg-amber-100 text-amber-700" :
                            "bg-emerald-100 text-emerald-700"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-t-2 border-border font-bold">
                    <td className="py-2 pr-3 text-foreground">Total</td>
                    <td className="py-2 px-3 text-right">${platformBom.reduce((s, b) => s + b.dce, 0)}</td>
                    <td className="py-2 px-3 text-right">
                      ${platformBom.reduce((s, b) => s + (b.quote ?? b.dce), 0)}
                    </td>
                    <td className="py-2 px-3 text-right text-destructive">
                      +${totalDceGap}
                    </td>
                    <td className="py-2 pl-3 text-right text-destructive">
                      +{platformBom.reduce((s, b) => s + b.dce, 0) > 0
                        ? ((totalDceGap / platformBom.reduce((s, b) => s + b.dce, 0)) * 100).toFixed(1)
                        : 0}%
                    </td>
                    <td className="py-2 pl-3" />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
