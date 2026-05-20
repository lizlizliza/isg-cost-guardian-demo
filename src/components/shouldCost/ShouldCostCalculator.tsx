import { useMemo, useState } from "react";
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
} from "../../data/constants";

export default function ShouldCostCalculator() {
  const [selectedId, setSelectedId] = useState<string>("air-baffle");
  const [params, setParams] = useState<ComponentParams>(DEFAULT_PARAMS["air-baffle"]);

  const selectedCommodity = COMMODITIES.find((c) => c.id === selectedId)!;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setParams({ ...DEFAULT_PARAMS[id] });
  };

  const updateParam = <K extends keyof ComponentParams>(key: K, value: ComponentParams[K]) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const breakdown: CostBreakdown = useMemo(
    () => calculateShouldCost(params, selectedId),
    [params, selectedId]
  );

  const sensitivity: SensitivityItem[] = useMemo(
    () => calcSensitivity(params, selectedId),
    [params, selectedId]
  );

  const costValues = useMemo(
    () => [
      breakdown.materialCost,
      breakdown.conversionCost,
      breakdown.nrePerUnit,
      breakdown.logisticsTotal,
      breakdown.eoReserve + breakdown.warrantyAdder,
      breakdown.marginOverhead,
    ],
    [breakdown]
  );

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Should Cost Calculator</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Parametric clean-sheet cost model &middot; Select a commodity to generate a dynamic DCE estimate
        </p>
      </div>

      {/* Info callout */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-[11px] text-blue-800">
        <span className="font-bold shrink-0">&copy;</span>
        <span>
          Variables are pre-loaded with SR650 V4 program defaults. Adjust any parameter to see real-time impact on should-cost. All figures in USD.
        </span>
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
            params={params}
          />

          {/* Physical Specifications */}
          <SectionGroup title="Physical Specifications" accent="#2563EB" callout="Surface area calculated from geometry model; update dimensions to recalculate.">
            <ParameterSlider label="Part Length" value={params.length} min={50} max={500} step={1} unit="mm" onChange={(v) => updateParam("length", v)} />
            <ParameterSlider label="Part Width" value={params.width} min={50} max={400} step={1} unit="mm" onChange={(v) => updateParam("width", v)} />
            <ParameterSlider label="Thickness" value={params.thickness} min={0.5} max={4} step={0.1} unit="mm" onChange={(v) => updateParam("thickness", v)} />
            {selectedId === "air-baffle" && (
              <ParameterSlider label="Vanes Count" value={params.extraDim1} min={1} max={20} step={1} unit="" onChange={(v) => updateParam("extraDim1", v)} />
            )}
            {selectedId === "top-cover" && (
              <ParameterSlider label="Cutout Area %" value={params.extraDim1} min={0} max={50} step={1} unit="%" onChange={(v) => updateParam("extraDim1", v)} />
            )}
            {selectedId === "riser-cage" && (
              <>
                <ParameterSlider label="Depth" value={params.extraDim1} min={20} max={200} step={1} unit="mm" onChange={(v) => updateParam("extraDim1", v)} />
                <ParameterSlider label="Mounting Holes" value={params.extraDim2} min={0} max={20} step={1} unit="" onChange={(v) => updateParam("extraDim2", v)} />
                <ParameterSlider label="Slot Count" value={params.slotCount} min={0} max={8} step={1} unit="" onChange={(v) => updateParam("slotCount", v)} />
              </>
            )}
            <ReadonlyField label="Surface Area" value={`~${breakdown.surfaceArea.toFixed(1)}`} unit="cm²" />
          </SectionGroup>

          {/* Raw Material */}
          <SectionGroup title="Raw Material" accent="#16A34A" subtotal={breakdown.materialCost.toFixed(2)}>
            <ParameterSelect label="Material Type" value={params.materialType} options={MATERIAL_OPTIONS} onChange={(v) => updateParam("materialType", v as ComponentParams["materialType"])} />
            <ParameterSlider label="Steel/Metal Index" value={params.steelIndex} min={0.4} max={1.6} step={0.01} unit="$/kg" onChange={(v) => updateParam("steelIndex", v)} />
            <ParameterSlider label="Scrap Yield" value={params.scrapYield} min={55} max={98} step={1} unit="%" onChange={(v) => updateParam("scrapYield", v)} />
            <ParameterSelect label="Surface Treatment" value={params.surfaceTreatment} options={SURFACE_TREATMENT_OPTIONS} onChange={(v) => updateParam("surfaceTreatment", v as ComponentParams["surfaceTreatment"])} />
          </SectionGroup>

          {/* Manufacturing & Labor */}
          <SectionGroup title="Manufacturing & Labor" accent="#D97706" subtotal={breakdown.conversionCost.toFixed(2)}>
            <ParameterSelect label="Location" value={params.location} options={LOCATION_OPTIONS} onChange={(v) => updateParam("location", v as ComponentParams["location"])} />
            <ReadonlyField label="Labor Rate" value={`$${LABOR_RATE[params.location]?.toFixed(2) ?? "0.00"}`} unit="/hr" />
            <ParameterSlider label="Assembly Steps" value={params.assemblySteps} min={1} max={25} step={1} unit="" onChange={(v) => updateParam("assemblySteps", v)} />
            <ParameterSlider label="Cycle Time/Step" value={params.cycleTimePerStep} min={0.2} max={5} step={0.1} unit="min" onChange={(v) => updateParam("cycleTimePerStep", v)} />
            <ParameterSlider label="First Pass Yield" value={params.firstPassYield} min={75} max={99.5} step={0.5} unit="%" onChange={(v) => updateParam("firstPassYield", v)} />
            <ParameterSlider label="Machine Depreciation" value={params.machineDepreciation} min={0} max={2} step={0.01} unit="$/u" onChange={(v) => updateParam("machineDepreciation", v)} />
            <ParameterSlider label="Test Time" value={params.testTime} min={0} max={10} step={0.5} unit="min" onChange={(v) => updateParam("testTime", v)} />
          </SectionGroup>

          {/* Logistics & Supply Chain */}
          <SectionGroup title="Logistics & Supply Chain" accent="#7C3AED" subtotal={breakdown.logisticsTotal.toFixed(2)}>
            <ParameterSelect label="Destination" value={params.destination} options={DESTINATION_OPTIONS} onChange={(v) => updateParam("destination", v as ComponentParams["destination"])} />
            <ParameterSelect label="Shipping Mode" value={params.shippingMode} options={SHIPPING_MODE_OPTIONS} onChange={(v) => updateParam("shippingMode", v as ComponentParams["shippingMode"])} />
            <ParameterSlider label="Tariff Rate" value={params.tariffRate} min={0} max={25} step={0.5} unit="%" onChange={(v) => updateParam("tariffRate", v)} />
            <ReadonlyField label="Lead Time" value={`${params.leadTime}`} unit="weeks" />
            <ReadonlyField label="Freight (In)" value={`$${breakdown.freightInbound.toFixed(2)}`} />
            <ReadonlyField label="Freight (Out)" value={`$${breakdown.freightOutbound.toFixed(2)}`} />
            <ReadonlyField label="Tariff Adder" value={`$${breakdown.tariffAdder.toFixed(2)}`} />
          </SectionGroup>

          {/* Tooling & NRE */}
          <SectionGroup title="Tooling & NRE Amortization" accent="#DC2626" subtotal={breakdown.nrePerUnit.toFixed(2)}>
            <ParameterSelect label="Tooling Type" value={params.toolingType} options={TOOLING_TYPE_OPTIONS} onChange={(v) => updateParam("toolingType", v as ComponentParams["toolingType"])} />
            <ParameterSlider label="NRE Total" value={params.nreTotal} min={5000} max={200000} step={1000} unit="$" onChange={(v) => updateParam("nreTotal", v)} />
            <ParameterSlider label="Prior Gen Reuse" value={params.priorGenReuse} min={0} max={100} step={5} unit="%" onChange={(v) => updateParam("priorGenReuse", v)} />
            <ParameterSlider label="Amortization Volume" value={params.amortizationVolume} min={5000} max={200000} step={1000} unit="" onChange={(v) => updateParam("amortizationVolume", v)} />
            <ParameterSlider label="ECA Adder" value={params.ecaAdder} min={0} max={1} step={0.01} unit="$/u" onChange={(v) => updateParam("ecaAdder", v)} />
            <ReadonlyField label="Effective NRE" value={`${breakdown.effectiveNRE.toFixed(0)}`} unit="$" />
          </SectionGroup>
        </div>

        {/* Right: Cost Output */}
        <div className="space-y-4">
          <CostBreakdownCard breakdown={breakdown} commodity={selectedCommodity} />
          <CostBuildUpBar values={costValues} />
          <CostCompareGrid values={costValues} />
          <SensitivityTable items={sensitivity} />

          {/* Commercial summary */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-5">
            <div className="section-label">Commercial Summary</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volume Tier</span>
                <span className="font-medium">{breakdown.volumeTier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volume Discount</span>
                <span className="font-medium text-emerald-600">{breakdown.volumeDiscount}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Terms</span>
                <span className="font-medium">{params.paymentTerms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Adder</span>
                <span className="font-medium text-destructive">+{breakdown.paymentAdder}%</span>
              </div>
              <div className="flex justify-between pt-1.5 mt-1.5 border-t border-border">
                <span className="text-muted-foreground">Margin / Overhead (16.8%)</span>
                <span className="font-medium">${breakdown.marginOverhead.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1.5 mt-1.5 border-t border-border">
                <span className="font-bold text-foreground">Should Cost</span>
                <span className="font-bold text-lg text-primary">${breakdown.shouldCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
