import { useMemo } from "react";
import { useData } from "../../context/DataContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";

interface CostWaterfallProps {
  platform: string;
}

export default function CostWaterfall({ platform }: CostWaterfallProps) {
  const { dashboard } = useData();

  const platformDash = useMemo(
    () => dashboard.filter((d) => d.platform === platform),
    [dashboard, platform]
  );

  const aci = useMemo(() => {
    const r = platformDash.find((d) => d.kpiType === "ACI");
    if (r && typeof r.value === "number") return r.value as number;
    // fallback for existing IndexedDB data before ACI dollar KPI was added
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

  // Derive gap values from ACI, DCE, CCE
  const aciToDceGap = aci > 0 ? (aci - dce) : 0;
  const dceToCceGap = dce > 0 ? (dce - cce) : 0;

  const chartData = [
    { name: "ACI", value: aci, fill: "#374151" },
    { name: "Gap", value: -(aciToDceGap * 0.5), fill: "#16A34A" },
    { name: "Gap", value: -(aciToDceGap * 0.5), fill: "#16A34A" },
    { name: "DCE", value: dce, fill: "#2563EB" },
    { name: "Gap", value: -(dceToCceGap * 0.5), fill: "#16A34A" },
    { name: "Gap", value: -(dceToCceGap * 0.5), fill: "#16A34A" },
    { name: "CCE", value: cce, fill: "#6B7280" },
  ];

  if (aci === 0 && dce === 0) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm p-5">
        <div className="section-label">Cost Waterfall — ACI → DCE → CCE</div>
        <p className="text-xs text-muted-foreground">No cost data for {platform}</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="section-label">Cost Waterfall — ACI → DCE → CCE</div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--color-muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--color-muted-foreground))" }} />
            <Tooltip
              formatter={(value: unknown) => `$${(value as number).toFixed(0)}`}
              labelStyle={{ color: "hsl(var(--color-foreground))" }}
              contentStyle={{ background: "hsl(var(--color-card))", border: "1px solid hsl(var(--color-border))", borderRadius: "8px" }}
            />
            <Bar dataKey="value">
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
        <span>ACI: ${aci}</span>
        <span className="text-emerald-600">→ -${aciToDceGap.toFixed(0)}</span>
        <span>DCE: ${dce}</span>
        <span className="text-destructive">→ -${dceToCceGap.toFixed(0)}</span>
        <span>CCE: ${cce}</span>
      </div>
    </div>
  );
}
