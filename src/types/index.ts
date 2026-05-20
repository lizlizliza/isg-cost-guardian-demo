export type MaterialType = "SECC Steel" | "SPCC Steel" | "Aluminum 5052" | "Stainless 304";
export type SurfaceTreatment = "None" | "Zinc coat (electro)" | "E-coat" | "Powder coat" | "Anodize";
export type MfgLocation = "Shenzhen, China" | "Chengdu, China" | "Penang, Malaysia" | "Monterrey, Mexico";
export type Destination = "ISG Assembly — Shenzhen" | "ISG Assembly — Hungary" | "ISG Assembly — Mexico";
export type ShippingMode = "Sea freight" | "Air freight" | "Intermodal";
export type ToolingType = "Progressive die stamp" | "Transfer die" | "Injection mold" | "Fabricated";
export type PaymentTerm = "Net 30" | "Net 60" | "Net 90";

export interface ComponentParams {
  length: number;
  width: number;
  thickness: number;
  extraDim1: number;
  extraDim2: number;
  slotCount: number;
  materialType: MaterialType;
  steelIndex: number;
  scrapYield: number;
  surfaceTreatment: SurfaceTreatment;
  location: MfgLocation;
  laborRate: number;
  assemblySteps: number;
  cycleTimePerStep: number;
  firstPassYield: number;
  machineDepreciation: number;
  testTime: number;
  destination: Destination;
  shippingMode: ShippingMode;
  tariffRate: number;
  leadTime: number;
  toolingType: ToolingType;
  nreTotal: number;
  priorGenReuse: number;
  amortizationVolume: number;
  ecaAdder: number;
  programVolume: number;
  moqBasis: string;
  paymentTerms: PaymentTerm;
  eoReservePct: number;
  warrantyAdder: number;
}

export interface Commodity {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  tagColor: "gray" | "blue";
  typicalDCE: string;
  partNo: string;
  assembly: string;
  lastGenRef: string;
  qualification: string;
  priorGenDCE: number;
  supplierQuote: number;
}

export interface CostBreakdown {
  materialCost: number;
  conversionCost: number;
  nrePerUnit: number;
  freightInbound: number;
  freightOutbound: number;
  tariffAdder: number;
  logisticsTotal: number;
  eoReserve: number;
  warrantyAdder: number;
  marginOverhead: number;
  subtotal: number;
  volumeTier: string;
  volumeDiscount: number;
  paymentAdder: number;
  shouldCost: number;
  surfaceArea: number;
  effectiveNRE: number;
}

export interface SensitivityItem {
  variable: string;
  negImpact: number;
  posImpact: number;
}

export interface PLPStage {
  name: string;
  active: boolean;
  completed: boolean;
  dateLabel: string;
  date: string;
}

export interface KeyDate {
  label: string;
  date: string;
}

export interface Commentary {
  function: string;
  color: string;
  owner: string;
  status: string;
  bullets: string[];
}

export interface BOMComponent {
  id: string;
  name: string;
  category: string;
  dce: number;
  preferredQuote: number | null;
  quoteVariance: number | null;
  quoteVariancePct: number | null;
  challenger1: number;
  challenger2: number;
  costMaturity: number;
  owner: string;
  status: string;
  aiInsight: string;
}

export interface WaterfallBar {
  label: string;
  value: number;
  type: "start" | "down" | "up" | "end";
  color: string;
}

export interface VarianceDriver {
  category: string;
  value: number;
  owner: string;
  notes: string;
  priority: string;
  status: string;
  bridge: string;
}

export interface Program {
  id: string;
  name: string;
  subtitle: string;
  volume: string;
  gate: string;
  programCode: string;
  fiscalYear: string;
  aciIndex: number;
  aciTarget: number;
  aciGap: number;
  dce: number;
  dcePrevGen: number;
  dceDelta: number;
  cce: number;
  pdci: number;
  cceGap: number;
  quoteCoverage: number;
  quotedCount: number;
  totalComponents: number;
  plpStages: PLPStage[];
  keyDates: KeyDate[];
  commentary: Commentary[];
  bomComponents: BOMComponent[];
  waterfallBars: WaterfallBar[];
  varianceDrivers: VarianceDriver[];
  componentWaterfalls: Record<string, {
    componentName: string;
    aci: number;
    dce: number;
    cce: number;
    waterfallBars: WaterfallBar[];
    varianceDrivers: VarianceDriver[];
  }>;
}
