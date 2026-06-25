import { useMemo } from "react";
import { useData } from "../../context/DataContext";
import BOMTable from "./BOMTable";

export default function L2BomAnalysis() {
  const { dashboard, bom, platform } = useData();

  const platformDash = useMemo(
    () => dashboard.filter((d) => d.platform === platform),
    [dashboard, platform]
  );
  const platformBom = useMemo(
    () => bom.filter((b) => b.platform === platform),
    [bom, platform]
  );

  const getN = (key: string) => {
    const r = platformDash.find((d) => d.kpiType === key);
    return r && typeof r.value === "number" ? r.value as number : 0;
  };

  const totalComponents = platformBom.length;
  const quotedCount = platformBom.filter((b) => b.quote != null).length;
  const quoteCoverage = totalComponents > 0 ? Math.round((quotedCount / totalComponents) * 100) : 0;
  const aci = getN("ACI_Index");
  const dce = getN("DCE");
  const aciGap = aci > 0 ? Math.round((aci - 1) * dce) : 0;

  return (
    <div className="fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">L2 BOM Analysis</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Level-2 Bill of Materials breakdown — {platform}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border shadow-sm p-4">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total Components</div>
          <div className="text-xl font-bold text-foreground mt-1">{totalComponents}</div>
        </div>
        <div className="bg-card rounded-xl border border-border shadow-sm p-4">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Quoted</div>
          <div className="text-xl font-bold text-foreground mt-1">{quotedCount}</div>
        </div>
        <div className="bg-card rounded-xl border border-border shadow-sm p-4">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Quote Coverage</div>
          <div className="text-xl font-bold text-foreground mt-1">{quoteCoverage}%</div>
        </div>
        <div className="bg-card rounded-xl border border-border shadow-sm p-4">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">ACI Gap</div>
          <div className="text-xl font-bold text-destructive mt-1">${aciGap}</div>
        </div>
      </div>

      <BOMTable />
    </div>
  );
}
