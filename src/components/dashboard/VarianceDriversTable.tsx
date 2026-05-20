import type { Program } from "../../types";

interface VarianceDriversTableProps {
  program: Program;
  bridge?: string;
}

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

export default function VarianceDriversTable({ program, bridge }: VarianceDriversTableProps) {
  const drivers = bridge
    ? program.varianceDrivers.filter((d) => d.bridge === bridge)
    : program.varianceDrivers;

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="section-label">Variance Drivers</div>
      <div className="space-y-2">
        {drivers.map((driver) => (
          <div key={driver.category} className="border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">{driver.category}</span>
                <span className="text-[10px] text-muted-foreground">${driver.value}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${PRIORITY_COLORS[driver.priority] || "bg-muted text-muted-foreground"}`}>
                  {driver.priority}
                </span>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${STATUS_COLORS[driver.status] || "bg-muted text-muted-foreground"}`}>
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
      </div>
    </div>
  );
}
