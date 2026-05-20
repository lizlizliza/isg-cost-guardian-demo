import type { Program } from "../../types";
import BOMTable from "./BOMTable";

interface L2BomAnalysisProps {
  program: Program;
}

export default function L2BomAnalysis({ program }: L2BomAnalysisProps) {
  return (
    <div className="fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">L2 BOM Analysis</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Level-2 Bill of Materials breakdown &mdash; {program.name}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border shadow-sm p-4">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total Components</div>
          <div className="text-xl font-bold text-foreground mt-1">{program.totalComponents}</div>
        </div>
        <div className="bg-card rounded-xl border border-border shadow-sm p-4">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Quoted</div>
          <div className="text-xl font-bold text-foreground mt-1">{program.quotedCount}</div>
        </div>
        <div className="bg-card rounded-xl border border-border shadow-sm p-4">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Quote Coverage</div>
          <div className="text-xl font-bold text-foreground mt-1">{program.quoteCoverage}%</div>
        </div>
        <div className="bg-card rounded-xl border border-border shadow-sm p-4">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">ACI Gap</div>
          <div className="text-xl font-bold text-destructive mt-1">${program.aciGap}</div>
        </div>
      </div>

      <BOMTable program={program} />
    </div>
  );
}
