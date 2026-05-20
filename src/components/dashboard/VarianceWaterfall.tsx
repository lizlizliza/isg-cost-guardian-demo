import type { Program } from "../../types";
import CostWaterfall from "./CostWaterfall";
import VarianceDriversTable from "./VarianceDriversTable";

interface VarianceWaterfallProps {
  program: Program;
}

export default function VarianceWaterfall({ program }: VarianceWaterfallProps) {
  return (
    <div className="fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Variance Waterfall</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Cost bridge analysis from ACI through DCE to CCE &mdash; {program.name}
        </p>
      </div>

      <CostWaterfall program={program} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VarianceDriversTable program={program} bridge="ACI→DCE" />
        <VarianceDriversTable program={program} bridge="DCE→CCE" />
      </div>
    </div>
  );
}
