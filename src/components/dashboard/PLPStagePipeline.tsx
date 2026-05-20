import type { Program } from "../../types";

interface PLPStagePipelineProps {
  program: Program;
}

export default function PLPStagePipeline({ program }: PLPStagePipelineProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="section-label">PLP Stage Pipeline</div>
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {program.plpStages.map((stage, i) => (
          <div key={stage.name} className="flex items-center gap-1 flex-1 min-w-0">
            <div
              className={`flex-1 text-center px-2 py-1.5 rounded-md text-[10px] font-semibold leading-tight transition-colors ${
                stage.active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : stage.completed
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <div className="truncate">{stage.name}</div>
              <div className="opacity-70 font-normal">{stage.date}</div>
            </div>
            {i < program.plpStages.length - 1 && (
              <div className="w-3 h-0.5 bg-border shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
