import { useMemo, useState, useCallback } from "react";
import type { ComponentParams, CostBreakdown, SensitivityItem } from "../../types";
import { COMMODITIES, DEFAULT_PARAMS } from "../../data/defaultParams";
import { calculateShouldCost } from "../../engine/shouldCost";
import { calcSensitivity } from "../../engine/sensitivity";
import CommodityCard from "../shared/CommodityCard";
import PartDiagram from "../shared/PartDiagram";
import CostBreakdownCard from "../shared/CostBreakdownCard";
import CostBuildUpBar from "../shared/CostBuildUpBar";
import CostCompareGrid from "../shared/CostCompareGrid";
import SensitivityTable from "../shared/SensitivityTable";
import SectionGroup from "../shared/SectionGroup";
import ParameterSlider from "../shared/ParameterSlider";
import ParameterSelect from "../shared/ParameterSelect";
import ReadonlyField from "../shared/ReadonlyField";
import {
  MATERIAL_OPTIONS,
  SURFACE_TREATMENT_OPTIONS,
  LOCATION_OPTIONS,
  DESTINATION_OPTIONS,
  SHIPPING_MODE_OPTIONS,
  TOOLING_TYPE_OPTIONS,
  LABOR_RATE,
  PAYMENT_TERM_OPTIONS,
} from "../../data/constants";
import { Info, Download, RotateCcw, Columns3 } from "lucide-react";
import * as XLSX from "xlsx";
import { COST_BAR_LABELS } from "../../data/constants";

const MOQ_BASIS_OPTIONS = ["MOQ only", "Annual volume", "Lifecycle volume"] as const;

function exportToExcel(
  commodityName: string,
  params: ComponentParams,
  breakdown: CostBreakdown
) {
  const rows: [string, string | number, string][] = [
    ["Commodity", commodityName, ""],
    ["", "", ""],
    ["Parameter", "Value", "Unit"],
    ["Part Length", params.length, "mm"],
    ["Part Width", params.width, "mm"],
    ["Thickness", params.thickness, "mm"],
    ["Material Type", params.materialType, ""],
    ["Steel/Metal Index", params.steelIndex, "$/kg"],
    ["Scrap Yield", params.scrapYield, "%"],
    ["Surface Treatment", params.surfaceTreatment, ""],
    ["Location", params.location, ""],
    ["Labor Rate", params.laborRate, "$/hr"],
    ["Assembly Steps", params.assemblySteps, ""],
    ["Cycle Time/Step", params.cycleTimePerStep, "min"],
    ["First Pass Yield", params.firstPassYield, "%"],
    ["Machine Depreciation", params.machineDepreciation, "$/u"],
    ["Test Time", params.testTime, "min"],
    ["Destination", params.destination, ""],
    ["Shipping Mode", params.shippingMode, ""],
    ["Tariff Rate", params.tariffRate, "%"],
    ["Lead Time", params.leadTime, "weeks"],
    ["Tooling Type", params.toolingType, ""],
    ["NRE Total", params.nreTotal, "$"],
    ["Prior Gen Reuse", params.priorGenReuse, "%"],
    ["Amortization Volume", params.amortizationVolume, "units"],
    ["ECA Adder", params.ecaAdder, "$/u"],
    ["Program Volume", params.programVolume, "units"],
    ["MOQ Basis", params.moqBasis, ""],
    ["Payment Terms", params.paymentTerms, ""],
    ["E&O Reserve Rate", params.eoReservePct, "%"],
    ["Warranty Adder", params.warrantyAdder, "$/u"],
    ["", "", ""],
    ["Cost Breakdown", "", ""],
    ["Cost Driver", "$/unit", "% of Total"],
  ];

  const logisticsFreight = breakdown.freightInbound + breakdown.freightOutbound;
  const baseCosts = [
    breakdown.materialCost,
    breakdown.conversionCost,
    breakdown.nrePerUnit,
    logisticsFreight,
    breakdown.tariffAdder,
    breakdown.eoReserve,
    breakdown.warrantyAdder,
  ];
  const subtotal = baseCosts.reduce((s, v) => s + v, 0);
  const volumeDiscountAmount = -(subtotal * breakdown.volumeDiscount / 100);
  const afterDiscount = subtotal + volumeDiscountAmount;
  const paymentAdderAmount = afterDiscount * breakdown.paymentAdder / 100;
  const costValues = [
    ...baseCosts,
    volumeDiscountAmount,
    paymentAdderAmount,
    breakdown.marginOverhead,
  ];

  const total = costValues.reduce((s, v) => s + v, 0);
  costValues.forEach((v, i) => {
    rows.push([COST_BAR_LABELS[i], v.toFixed(2), total > 0 ? `${((v / total) * 100).toFixed(1)}%` : "0%"]);
  });

  rows.push(["Should Cost Total", breakdown.shouldCost.toFixed(2), "100%"]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 28 }, { wch: 18 }, { wch: 14 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Should Cost Export");
  XLSX.writeFile(wb, `should-cost-${commodityName.replace(/\s+/g, "-").toLowerCase()}.xlsx`);
}

export default function ShouldCostCalculator() {
  const [selectedId, setSelectedId] = useState<string>("air-baffle");
  const [params, setParams] = useState<ComponentParams>(DEFAULT_PARAMS["air-baffle"]);
  const [snapshotB, setSnapshotB] = useState<ComponentParams | null>(null);
  const [viewB, setViewB] = useState(false);

  const selectedCommodity = COMMODITIES.find((c) => c.id === selectedId)!;

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setParams({ ...DEFAULT_PARAMS[id] });
    setSnapshotB(null);
    setViewB(false);
  }, []);

  const updateParam = useCallback(<K extends keyof ComponentParams>(key: K, value: ComponentParams[K]) => {
    setParams((prev) => {
      const next = { ...prev, [key]: value };
      // When location changes, auto-update labor rate from constant
      if (key === "location") {
        next.laborRate = LABOR_RATE[value as ComponentParams["location"]] ?? prev.laborRate;
      }
      return next;
    });
  }, []);

  const activeParams = viewB && snapshotB ? snapshotB : params;

  const breakdown: CostBreakdown = useMemo(
    () => calculateShouldCost(activeParams, selectedId),
    [activeParams, selectedId]
  );

  const sensitivity: SensitivityItem[] = useMemo(
    () => calcSensitivity(activeParams, selectedId),
    [activeParams, selectedId]
  );

  const costValues = useMemo(
    () => {
      const logisticsFreight = breakdown.freightInbound + breakdown.freightOutbound;
      const baseCosts = [
        breakdown.materialCost,
        breakdown.conversionCost,
        breakdown.nrePerUnit,
        logisticsFreight,
        breakdown.tariffAdder,
        breakdown.eoReserve,
        breakdown.warrantyAdder,
      ];
      const subtotal = baseCosts.reduce((s, v) => s + v, 0);
      const volumeDiscountAmount = -(subtotal * breakdown.volumeDiscount / 100);
      const afterDiscount = subtotal + volumeDiscountAmount;
      const paymentAdderAmount = afterDiscount * breakdown.paymentAdder / 100;
      return [
        ...baseCosts,
        volumeDiscountAmount,
        paymentAdderAmount,
        breakdown.marginOverhead,
      ];
    },
    [breakdown]
  );

  const snapToB = () => setSnapshotB({ ...params });
  const clearB = () => { setSnapshotB(null); setViewB(false); };

  const bBreakdown = snapshotB
    ? calculateShouldCost(snapshotB, selectedId)
    : null;

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div>
        <div className="section-label">SHOULD COST CALCULATOR</div>
        <h1 className="text-xl font-bold text-foreground mt-1">Should Cost Calculator</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Parametric clean-sheet cost model &middot; Select a commodity to generate a dynamic DCE estimate
        </p>
      </div>

      {/* Info callout */}
      <div className="flex justify-end">
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 w-full lg:w-1/3">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Variables are pre-loaded with SR650 V4 program defaults. Adjust any input to see the Should Cost recalculate in real time. This demonstrates the dynamic DCE capability the cost governance platform would enable.
          </span>
        </div>
      </div>

      {/* Compare A/B bar */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-3 flex items-center gap-3">
        <span className="text-xs font-semibold text-foreground">Compare:</span>
        <button
          onClick={() => setViewB(false)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
            !viewB ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          A: {params.materialType} / {params.surfaceTreatment} / {params.location.split(",")[0]}
        </button>
        {snapshotB ? (
          <>
            <button
              onClick={() => setViewB(true)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                viewB ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              B: {snapshotB.materialType} / {snapshotB.surfaceTreatment} / {snapshotB.location.split(",")[0]}
            </button>
            <button
              onClick={clearB}
              className="text-[10px] text-muted-foreground hover:text-destructive underline"
            >
              Clear B
            </button>
          </>
        ) : (
          <>
            <button
              onClick={snapToB}
              className="text-xs font-medium px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              Snap current to B
            </button>
            <span className="text-[10px] text-muted-foreground">Snapshot current params for side-by-side comparison</span>
          </>
        )}
        {snapshotB && viewB && (
          <span className="text-[10px] text-amber-600 font-medium ml-auto">
            Viewing snapshot B (read-only)
          </span>
        )}
      </div>

      {/* Commodity selection */}
      <div className="grid grid-cols-3 gap-4">
        {COMMODITIES.map((c) => (
          <CommodityCard
            key={c.id}
            commodity={c}
            selected={selectedId === c.id}
            onSelect={() => handleSelect(c.id)}
          />
        ))}
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Diagram + Parameters */}
        <div className="space-y-4">
          <PartDiagram
            commodity={selectedCommodity}
            surfaceArea={breakdown.surfaceArea}
            params={activeParams}
          />

          {/* Physical Specifications */}
          <SectionGroup title="Physical Specifications" accent="#2563EB" callout="Surface area calculated from geometry model; update dimensions to recalculate.">
            <ParameterSlider label="Part Length" value={activeParams.length} min={50} max={500} step={1} unit="mm" onChange={(v) => updateParam("length", v)} disabled={viewB} />
            <ParameterSlider label="Part Width" value={activeParams.width} min={50} max={400} step={1} unit="mm" onChange={(v) => updateParam("width", v)} disabled={viewB} />
            <ParameterSlider label="Thickness" value={activeParams.thickness} min={0.5} max={4} step={0.1} unit="mm" onChange={(v) => updateParam("thickness", v)} disabled={viewB} />
            {selectedId === "air-baffle" && (
              <ParameterSlider label="Vanes Count" value={activeParams.extraDim1} min={1} max={20} step={1} unit="" onChange={(v) => updateParam("extraDim1", v)} disabled={viewB} />
            )}
            {selectedId === "top-cover" && (
              <ParameterSlider label="Cutout Area %" value={activeParams.extraDim1} min={0} max={50} step={1} unit="%" onChange={(v) => updateParam("extraDim1", v)} disabled={viewB} />
            )}
            {selectedId === "riser-cage" && (
              <>
                <ParameterSlider label="Depth" value={activeParams.extraDim1} min={20} max={200} step={1} unit="mm" onChange={(v) => updateParam("extraDim1", v)} disabled={viewB} />
                <ParameterSlider label="Mounting Holes" value={activeParams.extraDim2} min={0} max={20} step={1} unit="" onChange={(v) => updateParam("extraDim2", v)} disabled={viewB} />
                <ParameterSlider label="Slot Count" value={activeParams.slotCount} min={0} max={8} step={1} unit="" onChange={(v) => updateParam("slotCount", v)} disabled={viewB} />
              </>
            )}
            <ReadonlyField label="Surface Area" value={`~${breakdown.surfaceArea.toFixed(1)}`} unit="cm²" />
          </SectionGroup>

          {/* Raw Material */}
          <SectionGroup title="Raw Material" accent="#16A34A" subtotal={breakdown.materialCost.toFixed(2)}>
            <ParameterSelect label="Material Type" value={activeParams.materialType} options={MATERIAL_OPTIONS} onChange={(v) => updateParam("materialType", v as ComponentParams["materialType"])} disabled={viewB} />
            <ParameterSlider label="Steel/Metal Index" value={activeParams.steelIndex} min={0.4} max={1.6} step={0.01} unit="$/kg" onChange={(v) => updateParam("steelIndex", v)} disabled={viewB} />
            <ParameterSlider label="Scrap Yield" value={activeParams.scrapYield} min={55} max={98} step={1} unit="%" onChange={(v) => updateParam("scrapYield", v)} disabled={viewB} />
            <ParameterSelect label="Surface Treatment" value={activeParams.surfaceTreatment} options={SURFACE_TREATMENT_OPTIONS} onChange={(v) => updateParam("surfaceTreatment", v as ComponentParams["surfaceTreatment"])} disabled={viewB} />
          </SectionGroup>

          {/* Manufacturing & Labor */}
          <SectionGroup title="Manufacturing & Labor" accent="#D97706" subtotal={breakdown.conversionCost.toFixed(2)}>
            <ParameterSelect label="Location" value={activeParams.location} options={LOCATION_OPTIONS} onChange={(v) => updateParam("location", v as ComponentParams["location"])} disabled={viewB} />
            <ParameterSlider label="Labor Rate" value={activeParams.laborRate} min={2} max={10} step={0.1} unit="$/hr" onChange={(v) => updateParam("laborRate", v)} disabled={viewB} />
            <ParameterSlider label="Assembly Steps" value={activeParams.assemblySteps} min={1} max={25} step={1} unit="" onChange={(v) => updateParam("assemblySteps", v)} disabled={viewB} />
            <ParameterSlider label="Cycle Time/Step" value={activeParams.cycleTimePerStep} min={0.2} max={5} step={0.1} unit="min" onChange={(v) => updateParam("cycleTimePerStep", v)} disabled={viewB} />
            <ParameterSlider label="First Pass Yield" value={activeParams.firstPassYield} min={75} max={99.5} step={0.5} unit="%" onChange={(v) => updateParam("firstPassYield", v)} disabled={viewB} />
            <ParameterSlider label="Machine Depreciation" value={activeParams.machineDepreciation} min={0} max={2} step={0.01} unit="$/u" onChange={(v) => updateParam("machineDepreciation", v)} disabled={viewB} />
            <ParameterSlider label="Test Time" value={activeParams.testTime} min={0} max={10} step={0.5} unit="min" onChange={(v) => updateParam("testTime", v)} disabled={viewB} />
          </SectionGroup>

          {/* Logistics & Supply Chain */}
          <SectionGroup title="Logistics & Supply Chain" accent="#7C3AED" subtotal={breakdown.logisticsTotal.toFixed(2)}>
            <ParameterSelect label="Destination" value={activeParams.destination} options={DESTINATION_OPTIONS} onChange={(v) => updateParam("destination", v as ComponentParams["destination"])} disabled={viewB} />
            <ParameterSelect label="Shipping Mode" value={activeParams.shippingMode} options={SHIPPING_MODE_OPTIONS} onChange={(v) => updateParam("shippingMode", v as ComponentParams["shippingMode"])} disabled={viewB} />
            <ParameterSlider label="Tariff Rate" value={activeParams.tariffRate} min={0} max={25} step={0.5} unit="%" onChange={(v) => updateParam("tariffRate", v)} disabled={viewB} />
            <ParameterSlider label="Lead Time" value={activeParams.leadTime} min={2} max={26} step={1} unit="weeks" onChange={(v) => updateParam("leadTime", v)} disabled={viewB} />
            <ReadonlyField label="Freight (In)" value={`$${breakdown.freightInbound.toFixed(2)}`} />
            <ReadonlyField label="Freight (Out)" value={`$${breakdown.freightOutbound.toFixed(2)}`} />
            <ReadonlyField label="Tariff Adder" value={`$${breakdown.tariffAdder.toFixed(2)}`} />
          </SectionGroup>

          {/* Tooling & NRE */}
          <SectionGroup title="Tooling & NRE Amortization" accent="#DC2626" subtotal={breakdown.nrePerUnit.toFixed(2)}>
            <ParameterSelect label="Tooling Type" value={activeParams.toolingType} options={TOOLING_TYPE_OPTIONS} onChange={(v) => updateParam("toolingType", v as ComponentParams["toolingType"])} disabled={viewB} />
            <ParameterSlider label="NRE Total" value={activeParams.nreTotal} min={5000} max={200000} step={1000} unit="$" onChange={(v) => updateParam("nreTotal", v)} disabled={viewB} />
            <ParameterSlider label="Prior Gen Reuse" value={activeParams.priorGenReuse} min={0} max={100} step={5} unit="%" onChange={(v) => updateParam("priorGenReuse", v)} disabled={viewB} />
            <ParameterSlider label="Amortization Volume" value={activeParams.amortizationVolume} min={5000} max={200000} step={1000} unit="" onChange={(v) => updateParam("amortizationVolume", v)} disabled={viewB} />
            <ParameterSlider label="ECA Adder" value={activeParams.ecaAdder} min={0} max={1} step={0.01} unit="$/u" onChange={(v) => updateParam("ecaAdder", v)} disabled={viewB} />
            <ReadonlyField label="Effective NRE" value={`${breakdown.effectiveNRE.toFixed(0)}`} unit="$" />
          </SectionGroup>

          {/* Volume & Commercial Terms */}
          <SectionGroup title="Volume & Commercial Terms" accent="#8B5CF6" subtotal={(breakdown.eoReserve + breakdown.warrantyAdder + breakdown.marginOverhead).toFixed(2)}>
            <ParameterSlider label="Program Volume" value={activeParams.programVolume} min={5000} max={200000} step={1000} unit="units" onChange={(v) => updateParam("programVolume", v)} disabled={viewB} />
            <ParameterSelect label="MOQ Basis" value={activeParams.moqBasis} options={MOQ_BASIS_OPTIONS} onChange={(v) => updateParam("moqBasis", v)} disabled={viewB} />
            <ReadonlyField label="Volume Tier" value={breakdown.volumeTier} />
            <ReadonlyField label="Tier Discount" value={`${breakdown.volumeDiscount}%`} />
            <ParameterSelect label="Payment Terms" value={activeParams.paymentTerms} options={PAYMENT_TERM_OPTIONS} onChange={(v) => updateParam("paymentTerms", v as ComponentParams["paymentTerms"])} disabled={viewB} />
            <ReadonlyField label="Payment Adder" value={`+${breakdown.paymentAdder}%`} />
            <ParameterSlider label="E&O Reserve Rate" value={activeParams.eoReservePct} min={0} max={5} step={0.1} unit="%" onChange={(v) => updateParam("eoReservePct", v)} disabled={viewB} />
            <ParameterSlider label="Warranty Adder" value={activeParams.warrantyAdder} min={0} max={2} step={0.05} unit="$/u" onChange={(v) => updateParam("warrantyAdder", v)} disabled={viewB} />
          </SectionGroup>
        </div>

        {/* Right: Cost Output */}
        <div className="space-y-4">
          <CostBreakdownCard
            breakdown={breakdown}
            commodity={selectedCommodity}
          />
          <CostBuildUpBar values={costValues} />
          {snapshotB && bBreakdown && (() => {
            const bFreight = bBreakdown.freightInbound + bBreakdown.freightOutbound;
            const bBaseCosts = [
              bBreakdown.materialCost,
              bBreakdown.conversionCost,
              bBreakdown.nrePerUnit,
              bFreight,
              bBreakdown.tariffAdder,
              bBreakdown.eoReserve,
              bBreakdown.warrantyAdder,
            ];
            const bSubtotal = bBaseCosts.reduce((s, v) => s + v, 0);
            const bVolDiscount = -(bSubtotal * bBreakdown.volumeDiscount / 100);
            const bAfterDiscount = bSubtotal + bVolDiscount;
            const bPaymentAdder = bAfterDiscount * bBreakdown.paymentAdder / 100;
            return (
              <CostBuildUpBar
                values={[
                  ...bBaseCosts,
                  bVolDiscount,
                  bPaymentAdder,
                  bBreakdown.marginOverhead,
                ]}
              />
            );
          })()}
          <CostCompareGrid values={costValues} />
          <SensitivityTable items={sensitivity} />

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportToExcel(selectedCommodity.name, params, breakdown)}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-primary text-primary rounded-lg text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Download className="w-4 h-4" />
              Export to DCE Model
            </button>
            <button
              onClick={() => {
                setParams({ ...DEFAULT_PARAMS[selectedId] });
                setSnapshotB(null);
                setViewB(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 border border-border text-muted-foreground rounded-lg text-sm font-medium hover:text-foreground hover:bg-secondary transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </button>
            <button
              onClick={() => {
                if (!snapshotB) {
                  setSnapshotB({ ...params });
                } else {
                  setViewB(!viewB);
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900 transition-colors ml-auto"
            >
              <Columns3 className="w-4 h-4" />
              Compare Scenarios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
