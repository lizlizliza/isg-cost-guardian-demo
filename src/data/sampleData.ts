import type { Program } from "../types";

export const PROGRAMS: Program[] = [
  {
    id: "sr650v4",
    name: "ThinkSystem SR650 V4",
    subtitle: "Server Platform · NPI Program · FY2025",
    volume: "48K units",
    gate: "Commit",
    programCode: "Neptune",
    fiscalYear: "FY2025",
    aciIndex: 1.08,
    aciTarget: 1.0,
    aciGap: 41,
    dce: 820,
    dcePrevGen: 791,
    dceDelta: 29,
    cce: 710,
    pdci: 115,
    cceGap: 110,
    quoteCoverage: 78,
    quotedCount: 14,
    totalComponents: 18,
    plpStages: [
      { name: "Pre-Commit", active: false, completed: true, dateLabel: "Entered", date: "Jan 22" },
      { name: "Commit", active: true, completed: false, dateLabel: "Key date", date: "Jan 22" },
      { name: "Development", active: false, completed: false, dateLabel: "Target", date: "Mar 13" },
      { name: "SUT", active: false, completed: false, dateLabel: "Target", date: "Apr 5" },
      { name: "Ship Support", active: false, completed: false, dateLabel: "Target", date: "Jun 11" },
    ],
    keyDates: [
      { label: "Pre-Commit Exit", date: "Jan 22" },
      { label: "Commit Entry", date: "Jan 22" },
      { label: "Commit Exit Target", date: "Mar 13" },
      { label: "SUT Target", date: "Apr 5" },
      { label: "SS Target", date: "Jun 11" },
    ],
    commentary: [
      {
        function: "TEC",
        color: "bg-blue-100 text-blue-700",
        owner: "Glen H.",
        status: "At Risk",
        bullets: [
          "Chassis sub-assembly spec finalized; quote +23% vs. DCE — escalation open",
          "DC-SCM Caliptra requirement under review; RFI response pending from Vendor A",
          "Cooling thermal solution validated at target TDP; fan solution on-track",
        ],
      },
      {
        function: "Procurement",
        color: "bg-emerald-100 text-emerald-700",
        owner: "Tim C.",
        status: "Action Required",
        bullets: [
          "Cable/interconnect RFI overdue (Vendor A, due Mar 15); re-routed, NRE delta TBC",
          "Chassis quote from Vendor B at $412 vs. DCE $335; arbitration session scheduled Mar 18",
          "Memory index not updated in target model — flagged to Cost Eng. for correction",
        ],
      },
      {
        function: "Cost Engineering",
        color: "bg-amber-100 text-amber-700",
        owner: "Joonil K.",
        status: "On Track",
        bullets: [
          "DCE refresh submitted post-Commit entry; 3 components pending TEC re-confirmation",
          "Arbitration on Chassis gap initiated; root cause: tooling NRE not embedded in original DCE",
          "Volume curve for mid-config updated; high-runner weighting applied",
        ],
      },
      {
        function: "Finance",
        color: "bg-violet-100 text-violet-700",
        owner: "KF",
        status: "At Risk",
        bullets: [
          "ACI index at 1.08; 8% above target — margin impact -$41/unit at current mix",
          "Gate co-sign conditional pending chassis + DC-SCM quote resolution",
          "P&L sensitivity: 1pt ACI improvement = +$0.9M contribution at 48K volume",
        ],
      },
      {
        function: "Product",
        color: "bg-gray-100 text-gray-700",
        owner: "Grant P.",
        status: "On Track",
        bullets: [
          "Feature selection locked for Commit gate; no scope changes approved post-entry",
          "Volume split confirmed: Base 52%, Mid 31%, High 17%",
          "Next milestone: Commit Exit Review — Mar 13",
        ],
      },
    ],
    bomComponents: [
      { id: "motherboard", name: "Motherboard", category: "ECAD", dce: 498, preferredQuote: 508, quoteVariance: 10, quoteVariancePct: 2, challenger1: 481, challenger2: 470, costMaturity: 3, owner: "Engineering", status: "At Risk", aiInsight: "Layer count reduction may save $15-20/unit" },
      { id: "chassis", name: "Chassis", category: "Mechanical", dce: 335, preferredQuote: 412, quoteVariance: 77, quoteVariancePct: 23, challenger1: 358, challenger2: 344, costMaturity: 2, owner: "Design", status: "Blocked", aiInsight: "Tooling NRE can be amortized across platforms" },
      { id: "dc-scm", name: "DC-SCM", category: "Management", dce: 210, preferredQuote: null, quoteVariance: null, quoteVariancePct: null, challenger1: 198, challenger2: 192, costMaturity: 2, owner: "TEC", status: "At Risk", aiInsight: "Caliptra waiver precedent from SR650 V3" },
      { id: "pcie-riser", name: "PCIe Riser", category: "Mechanical", dce: 142, preferredQuote: 161, quoteVariance: 19, quoteVariancePct: 13.4, challenger1: 135, challenger2: 130, costMaturity: 3, owner: "Design", status: "At Risk", aiInsight: "Volume aggregation with ISG Blade could cut 9-11%" },
      { id: "cable", name: "Cable / Interconnect", category: "Mechanical", dce: 64, preferredQuote: 88, quoteVariance: 24, quoteVariancePct: 37.5, challenger1: 61, challenger2: 58, costMaturity: 2, owner: "Procurement", status: "Blocked", aiInsight: "Re-source to Vendor C at $61 with updated routing spec" },
      { id: "storage-bp", name: "Storage Backplane", category: "ECAD", dce: 210, preferredQuote: 218, quoteVariance: 8, quoteVariancePct: 3.8, challenger1: 205, challenger2: 200, costMaturity: 4, owner: "Engineering", status: "OK", aiInsight: "Minimal gap; on track for cost target" },
      { id: "cooling-fans", name: "Cooling Fans", category: "Thermal", dce: 84, preferredQuote: 84, quoteVariance: 0, quoteVariancePct: 0, challenger1: 82, challenger2: 80, costMaturity: 5, owner: "Thermal", status: "OK", aiInsight: "Thermal solution validated; no action needed" },
      { id: "psu", name: "PSU", category: "Power", dce: 140, preferredQuote: 145, quoteVariance: 5, quoteVariancePct: 3.6, challenger1: 137, challenger2: 132, costMaturity: 4, owner: "Power", status: "OK", aiInsight: "Payment terms improvement potential" },
      { id: "nic-ocp", name: "NIC (OCP)", category: "ECAD", dce: 182, preferredQuote: 184, quoteVariance: 2, quoteVariancePct: 1.1, challenger1: 175, challenger2: 170, costMaturity: 4, owner: "Engineering", status: "OK", aiInsight: "OCP redesign vs. prior gen saved $12" },
    ],
    waterfallBars: [
      { label: "Acquisition Cost (ACI)", value: 886, type: "start", color: "#374151" },
      { label: "Commercial Competitiveness", value: -34, type: "down", color: "#16A34A" },
      { label: "Supplier Efficiency", value: -32, type: "down", color: "#16A34A" },
      { label: "DCE (Should-Cost)", value: 820, type: "end", color: "#2563EB" },
      { label: "Feature Selection", value: -55, type: "down", color: "#16A34A" },
      { label: "Design Decision", value: -55, type: "down", color: "#16A34A" },
      { label: "CCE (Ruthless Competitor)", value: 710, type: "end", color: "#6B7280" },
    ],
    varianceDrivers: [
      { category: "Commercial Competitiveness", value: 34, owner: "Strategic Procurement", notes: "Chassis +$77, Cable +$24, Riser +$19 vs. market benchmark pricing — supplier premiums exceed competitive reference points", priority: "Critical", status: "Open", bridge: "ACI→DCE" },
      { category: "Supplier Efficiency", value: 32, owner: "Cost Engineering", notes: "Machining cycle times 18% above benchmark; stamping yield loss at 12% vs. 5% target; sub-tier consolidation opportunity identified", priority: "Critical", status: "In Progress", bridge: "ACI→DCE" },
      { category: "Feature Selection", value: 55, owner: "Product Management", notes: "Hot-swap bays (+$22), 2nd GPU riser (+$18), enterprise mgmt module (+$15) — features not present in competitor baseline", priority: "High", status: "Open", bridge: "DCE→CCE" },
      { category: "Design Decision", value: 55, owner: "Mechanical Engineering", notes: "Tool-less rail design (+$20), redundant power path (+$19), acoustic dampening (+$16) — design choices driving cost above ruthless competitor", priority: "High", status: "In Progress", bridge: "DCE→CCE" },
    ],
    componentWaterfalls: {
      chassis: {
        componentName: "Chassis",
        aci: 412,
        dce: 335,
        cce: 295,
        waterfallBars: [
          { label: "Acquisition Cost (ACI)", value: 412, type: "start", color: "#374151" },
          { label: "Tooling NRE Premium", value: -42, type: "down", color: "#16A34A" },
          { label: "Commercial Gap", value: -28, type: "down", color: "#16A34A" },
          { label: "Misc. Adjustments", value: -7, type: "down", color: "#16A34A" },
          { label: "DCE (Should-Cost)", value: 335, type: "end", color: "#2563EB" },
          { label: "Design Simplification", value: -22, type: "down", color: "#16A34A" },
          { label: "Material Substitution", value: -18, type: "down", color: "#16A34A" },
          { label: "CCE (Ruthless Competitor)", value: 295, type: "end", color: "#6B7280" },
        ],
        varianceDrivers: [
          { category: "Tooling NRE Premium", value: 42, owner: "Strategic Procurement", notes: "New tooling for V4 chassis not amortized — single-platform NRE at $42/unit vs. $8-12 if pooled with HX8820", priority: "Critical", status: "Open", bridge: "ACI→DCE" },
          { category: "Commercial Gap", value: 28, owner: "Strategic Procurement", notes: "Vendor B pricing 23% over DCE; sole-source lock for V4 tooling", priority: "Critical", status: "Open", bridge: "ACI→DCE" },
          { category: "Design Simplification", value: 22, owner: "Mechanical Engineering", notes: "Mid-plane elimination saves $22/unit; impact on signal integrity under eval", priority: "High", status: "In Progress", bridge: "DCE→CCE" },
          { category: "Material Substitution", value: 18, owner: "Cost Engineering", notes: "SECC → Aluminum 5052 saves $18/unit; thermal dissipation validated", priority: "Medium", status: "In Progress", bridge: "DCE→CCE" },
        ],
      },
    },
  },
];

export function getProgramById(id: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}

export function getPLPStageData(programId: string): Record<string, { dce: number; aci: number } | null> {
  if (programId === "sr650v4") {
    return {
      "Pre-Commit": { dce: 856, aci: 1.18 },
      "Commit": { dce: 820, aci: 1.08 },
      "Development": null,
      "SUT": null,
      "Ship Support": null,
    };
  }
  return {
    "Pre-Commit": { dce: 702, aci: 1.2 },
    "Commit": { dce: 680, aci: 1.14 },
    "Development": { dce: 662, aci: 1.08 },
    "SUT": { dce: 650, aci: 1.04 },
    "Ship Support": { dce: 645, aci: 1.02 },
  };
}
