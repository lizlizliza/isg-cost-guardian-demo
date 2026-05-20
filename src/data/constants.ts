import type { MaterialType, SurfaceTreatment, MfgLocation, Destination, ShippingMode } from "../types";

export const MATERIAL_DENSITY: Record<MaterialType, number> = {
  "SECC Steel": 7.85,
  "SPCC Steel": 7.85,
  "Aluminum 5052": 2.70,
  "Stainless 304": 7.93,
};

export const SURFACE_TREATMENT_COST: Record<SurfaceTreatment, number> = {
  "None": 0,
  "Zinc coat (electro)": 0.35,
  "E-coat": 0.52,
  "Powder coat": 0.78,
  "Anodize": 1.10,
};

export const LABOR_RATE: Record<MfgLocation, number> = {
  "Shenzhen, China": 4.2,
  "Chengdu, China": 3.6,
  "Penang, Malaysia": 5.1,
  "Monterrey, Mexico": 6.8,
};

export const LOCATION_FLAG: Record<MfgLocation, string> = {
  "Shenzhen, China": "🇨🇳",
  "Chengdu, China": "🇨🇳",
  "Penang, Malaysia": "🇲🇾",
  "Monterrey, Mexico": "🇲🇽",
};

export const MATERIAL_OPTIONS: MaterialType[] = [
  "SECC Steel",
  "SPCC Steel",
  "Aluminum 5052",
  "Stainless 304",
];

export const SURFACE_TREATMENT_OPTIONS: SurfaceTreatment[] = [
  "None",
  "Zinc coat (electro)",
  "E-coat",
  "Powder coat",
  "Anodize",
];

export const LOCATION_OPTIONS: MfgLocation[] = [
  "Shenzhen, China",
  "Chengdu, China",
  "Penang, Malaysia",
  "Monterrey, Mexico",
];

export const DESTINATION_OPTIONS: Destination[] = [
  "ISG Assembly — Shenzhen",
  "ISG Assembly — Hungary",
  "ISG Assembly — Mexico",
];

export const SHIPPING_MODE_OPTIONS: ShippingMode[] = [
  "Sea freight",
  "Air freight",
  "Intermodal",
];

export const TOOLING_TYPE_OPTIONS = [
  "Progressive die stamp",
  "Transfer die",
  "Injection mold",
  "Fabricated",
];

export const PAYMENT_TERM_OPTIONS = ["Net 30", "Net 60", "Net 90"];

export const SHIPPING_COST: Record<string, { inbound: number; outbound: number }> = {
  "Shenzhen, China|ISG Assembly — Shenzhen": { inbound: 0.18, outbound: 0.22 },
  "Shenzhen, China|ISG Assembly — Hungary": { inbound: 0.18, outbound: 1.85 },
  "Shenzhen, China|ISG Assembly — Mexico": { inbound: 0.18, outbound: 1.45 },
  "Chengdu, China|ISG Assembly — Shenzhen": { inbound: 0.32, outbound: 0.22 },
  "Chengdu, China|ISG Assembly — Hungary": { inbound: 0.32, outbound: 1.85 },
  "Chengdu, China|ISG Assembly — Mexico": { inbound: 0.32, outbound: 1.45 },
  "Penang, Malaysia|ISG Assembly — Shenzhen": { inbound: 0.45, outbound: 0.55 },
  "Penang, Malaysia|ISG Assembly — Hungary": { inbound: 0.45, outbound: 1.60 },
  "Penang, Malaysia|ISG Assembly — Mexico": { inbound: 0.45, outbound: 1.70 },
  "Monterrey, Mexico|ISG Assembly — Shenzhen": { inbound: 0.60, outbound: 1.90 },
  "Monterrey, Mexico|ISG Assembly — Hungary": { inbound: 0.60, outbound: 1.20 },
  "Monterrey, Mexico|ISG Assembly — Mexico": { inbound: 0.60, outbound: 0.25 },
};

export const COST_BAR_COLORS = [
  "#2563EB",
  "#D97706",
  "#DC2626",
  "#7C3AED",
  "#16A34A",
  "#6B7280",
];

export const COST_BAR_LABELS = [
  "Material",
  "Conversion",
  "NRE / Unit",
  "Logistics + Tariff",
  "E&O + Warranty",
  "Margin / Overhead",
];

export function getVolumeTier(volume: number): { tier: string; discount: number } {
  if (volume >= 75000) return { tier: "Tier 1 (75K+)", discount: 5.1 };
  if (volume >= 25000) return { tier: "Tier 2 (25K–75K)", discount: 3.2 };
  if (volume >= 10000) return { tier: "Tier 3 (10K–25K)", discount: 1.5 };
  return { tier: "Tier 4 (<10K)", discount: 0 };
}

export function getPaymentAdder(terms: string): number {
  if (terms === "Net 30") return 0;
  if (terms === "Net 60") return 0.8;
  return 1.5;
}
