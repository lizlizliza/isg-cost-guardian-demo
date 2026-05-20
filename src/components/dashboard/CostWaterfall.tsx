import type { Program } from "../../types";

interface CostWaterfallProps {
  program: Program;
}

export default function CostWaterfall({ program }: CostWaterfallProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="section-label">Cost Waterfall &mdash; ACI &rarr; DCE &rarr; CCE</div>
      <div className="space-y-1">
        {program.waterfallBars.map((bar, i) => {
          const isStart = bar.type === "start";
          const isEnd = bar.type === "end";
          const isPositive = isEnd || bar.value >= 0;
          return (
            <div key={i} className="flex items-center gap-3 text-xs py-1">
              <div className="w-[180px] text-right text-muted-foreground truncate" title={bar.label}>
                {bar.label}
              </div>
              <div className="flex-1 flex items-center h-7">
                {isEnd ? (
                  <div
                    className="h-full rounded-r-md flex items-center px-3 text-white font-bold text-[11px]"
                    style={{ width: `${Math.abs(bar.value) / 12}%`, minWidth: "60px", backgroundColor: bar.color }}
                  >
                    ${bar.value}
                  </div>
                ) : isStart ? (
                  <div className="flex items-center gap-1">
                    <div
                      className="h-7 rounded-l-md flex items-center px-3 text-white font-bold text-[11px]"
                      style={{ backgroundColor: bar.color }}
                    >
                      ${bar.value}
                    </div>
                    <div className="w-0 h-0 border-t-[14px] border-b-[14px] border-l-[10px] border-t-transparent border-b-transparent"
                      style={{ borderLeftColor: bar.color }} />
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div
                      className="flex items-center gap-1 h-7 rounded-l-md text-white font-bold text-[11px]"
                      style={{ backgroundColor: bar.color, minWidth: "40px" }}
                    >
                      <span className="px-2">
                        {isPositive ? "+" : ""}${bar.value}
                      </span>
                    </div>
                    <div className="w-0 h-0 border-t-[14px] border-b-[14px] border-l-[10px] border-t-transparent border-b-transparent"
                      style={{ borderLeftColor: bar.color }} />
                  </div>
                )}
                <div className="flex-1 border-b border-dashed border-border mx-2" />
              </div>
              <div className="w-[100px] text-left font-semibold text-foreground">
                ${bar.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
