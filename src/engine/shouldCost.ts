import type { ComponentParams, CostBreakdown } from "../types";
import { MATERIAL_DENSITY } from "../data/constants";
import { SURFACE_TREATMENT_COST } from "../data/constants";
import { SHIPPING_COST } from "../data/constants";
import { getVolumeTier, getPaymentAdder } from "../data/constants";
import { calcSurfaceArea } from "./surfaceArea";

export function calculateShouldCost(
  params: ComponentParams,
  componentId: string
): CostBreakdown {
  const surfaceArea = calcSurfaceArea(params, componentId);
  const density = MATERIAL_DENSITY[params.materialType];
  const treatmentCost = SURFACE_TREATMENT_COST[params.surfaceTreatment];

  const materialCost =
    surfaceArea *
    (params.thickness * 0.1) *
    0.001 *
    density *
    params.steelIndex /
    (params.scrapYield / 100) +
    treatmentCost;

  const conversionCost =
    (params.assemblySteps * params.cycleTimePerStep) / 60 *
    params.laborRate /
    (params.firstPassYield / 100) +
    params.machineDepreciation +
    params.testTime * (params.laborRate / 60);

  const effectiveNRE = params.nreTotal * (1 - params.priorGenReuse / 100);
  const nrePerUnit = effectiveNRE / params.amortizationVolume + params.ecaAdder;

  const routeKey = `${params.location}|${params.destination}`;
  const freight = SHIPPING_COST[routeKey] || { inbound: 0.5, outbound: 0.5 };
  const tariffAdder = materialCost * (params.tariffRate / 100);
  const logisticsTotal = freight.inbound + freight.outbound + tariffAdder;

  const eoReserve = materialCost * (params.eoReservePct / 100);

  const subtotal =
    materialCost +
    conversionCost +
    nrePerUnit +
    logisticsTotal +
    eoReserve +
    params.warrantyAdder;

  const volumeInfo = getVolumeTier(params.programVolume);
  const paymentAdder = getPaymentAdder(params.paymentTerms);

  const afterDiscount = subtotal * (1 - volumeInfo.discount / 100);
  const afterPayment = afterDiscount * (1 + paymentAdder / 100);
  const marginOverhead = afterPayment * 0.168;
  const shouldCost = afterPayment + marginOverhead;

  return {
    materialCost: +materialCost.toFixed(2),
    conversionCost: +conversionCost.toFixed(2),
    nrePerUnit: +nrePerUnit.toFixed(2),
    freightInbound: freight.inbound,
    freightOutbound: freight.outbound,
    tariffAdder: +tariffAdder.toFixed(2),
    logisticsTotal: +logisticsTotal.toFixed(2),
    eoReserve: +eoReserve.toFixed(2),
    warrantyAdder: params.warrantyAdder,
    marginOverhead: +marginOverhead.toFixed(2),
    subtotal: +subtotal.toFixed(2),
    volumeTier: volumeInfo.tier,
    volumeDiscount: volumeInfo.discount,
    paymentAdder,
    shouldCost: +shouldCost.toFixed(2),
    surfaceArea: +surfaceArea.toFixed(1),
    effectiveNRE: +effectiveNRE.toFixed(0),
  };
}
