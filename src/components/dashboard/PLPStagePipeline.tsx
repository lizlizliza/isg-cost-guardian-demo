import { useMemo } from "react";
import type { PipelineRecord } from "../../types";

interface PLPStagePipelineProps {
  pipeline: PipelineRecord[];
  platform: string;
}

type StageColor = "light-blue" | "blue" | "gray";

interface StageDisplay {
  name: string;
  color: StageColor;
  dateLabel: string;
  dce: string | null;
  aci: string | null;
}

const STAGE_COST: Record<string, Record<number, { dce: string; aci: string }>> = {
  "SR650 V4": {
    1: { dce: "$856", aci: "1.18" },
    2: { dce: "$820", aci: "1.08" },
  },
  "SR630 V3": {
    1: { dce: "$680", aci: "1.05" },
    2: { dce: "$645", aci: "0.98" },
  },
};

const STATUS_LABEL: Record<number, string> = {
  1: "Entered",
  2: "Key date",
};

const PILLS: Record<string, string[]> = {
  "SR650 V4": [
    "Pre-Commit Exit: Jan 22",
    "Commit Entry: Jan 22",
    "Commit Exit Target: Mar 13",
    "SUT Target: Apr 5",
    "SS Target: Jun 11",
  ],
  "SR630 V3": [
    "Pre-Commit Exit: Oct 15",
    "Commit Entry: Nov 8",
    "Commit Exit Target: Feb 20",
    "SUT Target: Apr 10",
    "SS Target: Jul 15",
  ],
};

export default function PLPStagePipeline({ pipeline, platform }: PLPStagePipelineProps) {
  const stages: StageDisplay[] = useMemo(() => {
    const filtered = pipeline
      .filter((p) => (p.platform ?? "").trim() === (platform ?? "").trim())
      .sort((a, b) => a.stage - b.stage);

    const seen = new Set<number>();
    const unique = filtered.filter((p) => {
      if (seen.has(p.stage)) return false;
      seen.add(p.stage);
      return true;
    });

    return unique.map((s): StageDisplay => {
      const color: StageColor = s.stage === 1 ? "light-blue" : s.stage === 2 ? "blue" : "gray";
      const cost = STAGE_COST[platform]?.[s.stage];
      const prefix = STATUS_LABEL[s.stage] || "Target";
      return {
        name: s.stageName,
        color,
        dateLabel: `${prefix}: ${s.date}`,
        dce: cost?.dce ?? null,
        aci: cost?.aci ?? null,
      };
    });
  }, [pipeline, platform]);

  const pills = PILLS[platform] || [];

  if (stages.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm p-5">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5">PLP Stage Pipeline</div>
        <p className="text-xs text-muted-foreground">No pipeline data for {platform}</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5">PLP Stage Pipeline</div>

      {/* Arrow chain */}
      <div className="flex mb-3">
        {stages.map((s, i) => {
          const isFirst = i === 0;
          const isLast = i === stages.length - 1;

          let clipPath: string;
          if (isFirst) {
            clipPath = "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 0 50%)";
          } else if (isLast) {
            clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%, 14px 50%)";
          } else {
            clipPath = "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)";
          }

          let bgStyle: React.CSSProperties;
          if (s.color === "light-blue") {
            bgStyle = { background: "linear-gradient(135deg, #93B4F5, #60A5FA)", color: "#fff" };
          } else if (s.color === "blue") {
            bgStyle = { background: "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "#fff" };
          } else {
            bgStyle = { background: "#E5E7EB", color: "#6B7280" };
          }

          return (
            <div
              key={s.name}
              className="flex-1 flex items-center justify-center py-4 px-4 select-none"
              style={{
                clipPath,
                marginLeft: isFirst ? "0" : "-10px",
                zIndex: stages.length - i,
                ...bgStyle,
              }}
            >
              <span className="text-sm font-bold text-center leading-tight">{s.name}</span>
            </div>
          );
        })}
      </div>

      {/* Info row — date + DCE + ACI per stage */}
      <div className="flex mb-2">
        {stages.map((s) => (
          <div key={s.name} className="flex-1 text-center text-[11px] text-muted-foreground leading-relaxed px-1">
            <span className="block">{s.dateLabel}</span>
            {s.dce && <span className="block">DCE: {s.dce}</span>}
            {s.aci && <span className="block font-semibold text-foreground">ACI: {s.aci}</span>}
          </div>
        ))}
      </div>

      {/* Footer pills */}
      {pills.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          {pills.map((p) => (
            <span
              key={p}
              className="text-[10px] text-muted-foreground bg-secondary rounded-full px-3 py-1"
            >
              {p}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
