import type { Program } from "../../types";
import PLPStagePipeline from "./PLPStagePipeline";
import BOMTable from "./BOMTable";
import CostWaterfall from "./CostWaterfall";
import VarianceDriversTable from "./VarianceDriversTable";
import CommentarySection from "./CommentarySection";

interface ProgramDashboardProps {
  program: Program;
}

export default function ProgramDashboard({ program }: ProgramDashboardProps) {
  return (
    <div className="fade-in space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border shadow-sm p-4">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">ACI Index</div>
          <div className="text-xl font-bold text-foreground mt-1">{program.aciIndex.toFixed(2)}</div>
          <div className={`text-[10px] font-medium mt-0.5 ${program.aciIndex > program.aciTarget ? "text-destructive" : "text-emerald-600"}`}>
            vs target {program.aciTarget.toFixed(2)} {program.aciIndex > program.aciTarget ? "▲" : "▼"}
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border shadow-sm p-4">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">DCE</div>
          <div className="text-xl font-bold text-foreground mt-1">${program.dce}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            vs Prev ${program.dcePrevGen} <span className="text-emerald-600">+${program.dceDelta}</span>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border shadow-sm p-4">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">CCE</div>
          <div className="text-xl font-bold text-foreground mt-1">${program.cce}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Gap: <span className="text-destructive">${program.cceGap}</span>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border shadow-sm p-4">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">PDCI</div>
          <div className="text-xl font-bold text-foreground mt-1">{program.pdci}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Quote coverage: <span className="font-medium">{program.quoteCoverage}%</span>
          </div>
        </div>
      </div>

      {/* Key Info Row */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground bg-card rounded-xl border border-border shadow-sm px-5 py-3">
        <span><span className="font-medium text-foreground">Gate:</span> {program.gate}</span>
        <span><span className="font-medium text-foreground">Volume:</span> {program.volume}</span>
        <span><span className="font-medium text-foreground">Code:</span> {program.programCode}</span>
        <span><span className="font-medium text-foreground">FY:</span> {program.fiscalYear}</span>
      </div>

      {/* PLP Pipeline */}
      <PLPStagePipeline program={program} />

      {/* Cost Waterfall */}
      <CostWaterfall program={program} />

      {/* BOM Table */}
      <BOMTable program={program} />

      {/* Variance Drivers */}
      <VarianceDriversTable program={program} />

      {/* Commentary */}
      <CommentarySection program={program} />
    </div>
  );
}
