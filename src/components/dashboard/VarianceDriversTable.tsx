const DATA: Record<string, { category: string; value: number; owner: string; notes: string; priority: string; status: string }[]> = {
  "ACI→DCE": [
    { category: "Commercial Competitiveness", value: 34, owner: "Strategic Procurement", notes: "Chassis +$77, Cable +$24, Riser +$19 vs. competitive benchmarks — supplier premiums exceed reference points", priority: "Critical", status: "Open" },
    { category: "Supplier Efficiency", value: 32, owner: "Cost Engineering", notes: "Machining cycle times 18% above benchmark; stamping yield loss at 12% vs. 5% target", priority: "Critical", status: "In Progress" },
  ],
  "DCE→CCE": [
    { category: "Feature Selection", value: 55, owner: "Product Management", notes: "Hot-swap bays (+$22), 2nd GPU riser (+$18), enterprise mgmt module (+$15)", priority: "High", status: "Open" },
    { category: "Design Decision", value: 55, owner: "Mechanical Engineering", notes: "Tool-less rail design (+$20), redundant power path (+$19), acoustic dampening (+$16)", priority: "High", status: "In Progress" },
  ],
};

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-amber-100 text-amber-700",
  Medium: "bg-blue-100 text-blue-700",
};

const STATUS_COLORS: Record<string, string> = {
  Open: "bg-red-100 text-red-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Closed: "bg-emerald-100 text-emerald-700",
};

interface VarianceDriversTableProps {
  bridge: "ACI→DCE" | "DCE→CCE";
}

export default function VarianceDriversTable({ bridge }: VarianceDriversTableProps) {
  const drivers = DATA[bridge] || [];
  const subtotal = drivers.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="section-label">Variance Drivers — {bridge}</div>
      <div className="space-y-2">
        {drivers.map((driver) => (
          <div key={driver.category} className="border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">{driver.category}</span>
                <span className="text-[10px] text-muted-foreground">${driver.value}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${PRIORITY_COLORS[driver.priority] || ""}`}>
                  {driver.priority}
                </span>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${STATUS_COLORS[driver.status] || ""}`}>
                  {driver.status}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">{driver.notes}</p>
            <div className="text-[9px] text-muted-foreground mt-1">
              Owner: <span className="font-medium text-foreground">{driver.owner}</span>
            </div>
          </div>
        ))}

        {/* Subtotal row */}
        <div className="flex items-center justify-between border-t-2 border-border pt-3 mt-2">
          <span className="text-xs font-bold text-foreground">Subtotal · {drivers.length} drivers</span>
          <span className="text-xs font-bold text-destructive">${subtotal}</span>
        </div>
      </div>
    </div>
  );
}
