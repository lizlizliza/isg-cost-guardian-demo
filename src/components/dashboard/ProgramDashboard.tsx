import { useMemo, useState } from "react";
import { useData } from "../../context/DataContext";
import PLPStagePipeline from "./PLPStagePipeline";
import BOMTable from "./BOMTable";
import CostWaterfall from "./CostWaterfall";
import VarianceDriversTable from "./VarianceDriversTable";
import type { Commentary } from "../../types";

const EXECUTIVE_SUMMARY = [
  {
    title: "Governance Blockage",
    text: "The SR650 V4 program entered Commit gate on Jan 22 with a $110 cost gap (DCE $820 vs. CCE $710). Supplier negotiations are underway on 4 of 9 BOM components, with Chassis and Cable/Interconnect flagged as Blocked. The Governance Board requires a cost bridge resolution plan before Development exit at Mar 13.",
  },
  {
    title: "Key Design Decision",
    text: "Engineering is evaluating two design trade-offs: (1) replacing the enterprise management module with a lighter BMC-based solution to save $15/unit, and (2) consolidating the 2nd GPU riser into the base motherboard layout. Both changes require re-qualification and would push SUT by 2–3 weeks if approved.",
  },
  {
    title: "Procurement Update",
    text: "DC-SCM component remains unquoted, contributing to the 78% quote coverage gap. Strategic Procurement has engaged two alternate suppliers for Cable/Interconnect (Vendor C at $61 vs. incumbent at $88). Chassis tooling NRE renegotiation is targeting 15% reduction through multi-platform amortization with ISG Blade.",
  },
  {
    title: "PLP Trend",
    text: "Pre-Commit to Commit was compressed (both gates at Jan 22), reflecting an accelerated front-end schedule. Current Development phase is tracking on plan with SUT scheduled for Apr 5. Ship Support gate at Jun 11 aligns with the SR650 V4 product launch window. Risk buffer: 3 weeks remaining.",
  },
  {
    title: "Actions to Close Gap",
    text: "Three workstreams are active: (1) Strategic Procurement — close 4 open supplier negotiations by Feb 15, targeting $55 in savings; (2) Cost Engineering — validate machining cycle time benchmarks and stamping yield improvements for $32 in DCE uplift; (3) Product Management — prioritize feature de-scoping options if negotiations stall, with $55 in contingent savings identified.",
  },
];

const COMMENTARY_DATA: Commentary[] = [
  {
    function: "Strategic Procurement",
    color: "#2563EB",
    owner: "Tim Chen",
    status: "Active",
    bullets: [
      "Supplier RFP round 2 closed Jan 18; 4 responses received for Chassis and Cable packages",
      "Vendor C alternate quote at $61/unit for Cable/Interconnect — $27 below incumbent",
      "Target: close all open negotiations ahead of Feb 15 Cost Review",
    ],
  },
  {
    function: "Cost Engineering",
    color: "#16A34A",
    owner: "Joonil Kim",
    status: "Active",
    bullets: [
      "Machining cycle time benchmark data collected from 3 supplier sites; 18% above reference",
      "Stamping yield improvement plan: target 88% (from 82%) through die maintenance + process audit",
      "DCE uplift potential: $32/unit from efficiency levers alone",
    ],
  },
  {
    function: "Mechanical Engineering",
    color: "#D97706",
    owner: "Glen Huang",
    status: "Review",
    bullets: [
      "Tool-less rail design and acoustic dampening add $36/unit to MBoM cost",
      "Evaluating reduced baffle thickness (2.0→1.6mm) to offset rail cost — thermal impact TBD",
      "Redundant power path re-qualification complete; no regression expected",
    ],
  },
  {
    function: "Product Management",
    color: "#7C3AED",
    owner: "Grant Peng",
    status: "Active",
    bullets: [
      "Feature de-scoping options identified: enterprise mgmt module ($15), 2nd GPU riser ($18)",
      "Customer requirement survey in field; initial feedback favors keeping full IO configurability",
      "Fallback: defer hot-swap bays to post-launch FRU if cost gap persists",
    ],
  },
  {
    function: "Finance DT",
    color: "#DC2626",
    owner: "Kevin Fang",
    status: "Active",
    bullets: [
      "Cost Guardian v2 PoC tracking SR650 V4 cost bridge in real time",
      "ACI→DCE gap narrowed from +$82 (Nov) to +$66 (Jan) through procurement progress",
      "Next milestone: DCE→CCE gap closure target of $55 by Feb 28 Cost Review",
    ],
  },
];

function getKpi(dashboard: { kpiType: string; value: number | string }[], key: string): string {
  const r = dashboard.find((d) => d.kpiType === key);
  if (!r) return "—";
  return typeof r.value === "number" ? (r.value as number).toLocaleString() : String(r.value);
}
function getKpiNum(dashboard: { kpiType: string; value: number | string }[], key: string): number {
  const r = dashboard.find((d) => d.kpiType === key);
  if (!r) return 0;
  return typeof r.value === "number" ? r.value as number : parseFloat(String(r.value)) || 0;
}

export default function ProgramDashboard() {
  const { dashboard, pipeline, platform, uploadMeta } = useData();
  const [activeBridge, setActiveBridge] = useState<"ACI→DCE" | "DCE→CCE">("ACI→DCE");

  const platformDash = useMemo(
    () => dashboard.filter((d) => d.platform === platform),
    [dashboard, platform]
  );

  const aciIndex = getKpiNum(platformDash, "ACI_Index");
  const dce = getKpiNum(platformDash, "DCE");
  const quoteCov = getKpiNum(platformDash, "Quote_Coverage");
  const volume = getKpi(platformDash, "Volume");
  const gate = getKpi(platformDash, "Gate");
  const code = getKpi(platformDash, "Code");

  const lastUpload = uploadMeta.length > 0 ? uploadMeta[0] : null;

  const dcePrev = 791; // SR650 V4 previous gen DCE
  const dceDelta = dce - dcePrev;

  return (
    <div className="fade-in space-y-6">
      {/* Program Overview */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Program Overview</div>
        <h2 className="text-2xl font-bold text-foreground">{platform}</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-5">Server Platform · NPI Program · FY2025</p>
        <div className="flex gap-12 flex-wrap">
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Volume</div>
            <div className="text-lg font-bold text-foreground mt-1">{Number(volume).toLocaleString()} units</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Gate</div>
            <div className="text-lg font-bold text-foreground mt-1">{gate}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider"># Program Code</div>
            <div className="text-lg font-bold text-foreground mt-1">{code}</div>
          </div>
        </div>
      </div>

      {/* PLP Stage Pipeline */}
      <PLPStagePipeline pipeline={pipeline} platform={platform} />

      {/* KPI Cards — 3 */}
      <div className="grid grid-cols-3 gap-6">
        {/* ACI Index */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-7 text-center">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">ACI Index</div>
          <div className="text-4xl font-extrabold text-primary leading-none mb-2">{aciIndex.toFixed(2)}</div>
          <div className="text-sm font-medium text-foreground mb-2">Acquisition Cost Index</div>
          <div className="text-[13px] text-muted-foreground">
            Target: 1.00 &middot; Gap: +${dce - (aciIndex * 700 || 0)} vs. DCE
          </div>
        </div>

        {/* DCE */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-7 text-center">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">DCE</div>
          <div className="text-4xl font-extrabold text-foreground leading-none mb-2">${dce}</div>
          <div className="text-sm font-medium text-foreground mb-2">Typical Model · Mid Config</div>
          <div className="text-[13px] text-muted-foreground">
            Prev. Gen: ${dcePrev} &middot; &Delta; {dceDelta >= 0 ? "+" : ""}${dceDelta}
          </div>
        </div>

        {/* Quote Coverage */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-7 text-center">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quote Coverage</div>
          <div className="text-4xl font-extrabold text-foreground leading-none mb-2">{quoteCov}%</div>
          <div className="text-sm font-medium text-foreground mb-3">RFQ / Quote Coverage</div>
          <div className="h-1.5 bg-slate-200 rounded-full mb-2 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(quoteCov, 100)}%` }}
            />
          </div>
          <div className="text-[13px] text-muted-foreground">
            14 of 18 L2 components quoted
          </div>
        </div>
      </div>

      {/* Cost Waterfall */}
      <CostWaterfall platform={platform} />

      {/* BOM Table */}
      <BOMTable />

      {/* Executive Summary */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-5">
        <div className="section-label">Executive Summary</div>
        <div className="space-y-4">
          {EXECUTIVE_SUMMARY.map((item) => (
            <div key={item.title}>
              <h3 className="text-xs font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Commentary */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-5">
        <div className="section-label">Commentary</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMMENTARY_DATA.map((c) => (
            <div
              key={c.function}
              className="border border-border rounded-lg p-3 flex flex-col gap-2"
              style={{ borderLeftColor: c.color, borderLeftWidth: "3px" }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: c.color }}
                >
                  {c.function}
                </span>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                  c.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {c.status}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                Owner: <span className="font-semibold text-foreground">{c.owner}</span>
              </div>
              <ul className="text-[10px] text-muted-foreground space-y-1 pl-3 list-disc">
                {c.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Variance Drivers */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveBridge("ACI→DCE")}
            className={`text-xs font-semibold px-3 py-1 rounded-md transition-colors ${
              activeBridge === "ACI→DCE" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ACI → DCE
          </button>
          <button
            onClick={() => setActiveBridge("DCE→CCE")}
            className={`text-xs font-semibold px-3 py-1 rounded-md transition-colors ${
              activeBridge === "DCE→CCE" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            DCE → CCE
          </button>
        </div>
        <VarianceDriversTable bridge={activeBridge} />
      </div>

      {/* Data source footer */}
      <div className="text-[10px] text-muted-foreground text-right">
        {lastUpload ? (
          <>Data source: {lastUpload.fileName} &middot; Last updated: {new Date(lastUpload.uploadedAt).toLocaleString()}</>
        ) : (
          <>Data source: Demo data (SR650 V4 + SR630 V3)</>
        )}
      </div>
    </div>
  );
}
