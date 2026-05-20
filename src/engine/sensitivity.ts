import type { ComponentParams, SensitivityItem } from "../types";
import { calculateShouldCost } from "./shouldCost";

const SENSITIVITY_FACTORS = [
  { key: "steelIndex" as const, label: "Steel Index" },
  { key: "programVolume" as const, label: "Program Volume" },
  { key: "laborRate" as const, label: "Labor Rate" },
  { key: "tariffRate" as const, label: "Tariff Rate" },
  { key: "firstPassYield" as const, label: "First Pass Yield" },
  { key: "amortizationVolume" as const, label: "NRE Amortization Vol." },
];

export function calcSensitivity(
  params: ComponentParams,
  componentId: string
): SensitivityItem[] {
  const baseline = calculateShouldCost(params, componentId).shouldCost;

  return SENSITIVITY_FACTORS.map(({ key, label }) => {
    const baseVal = params[key];
    const lower = { ...params, [key]: baseVal * 0.9 };
    const upper = { ...params, [key]: baseVal * 1.1 };
    return {
      variable: label,
      negImpact: +(
        calculateShouldCost(lower, componentId).shouldCost - baseline
      ).toFixed(2),
      posImpact: +(
        calculateShouldCost(upper, componentId).shouldCost - baseline
      ).toFixed(2),
    };
  }).sort((a, b) => Math.abs(b.posImpact) - Math.abs(a.posImpact));
}
