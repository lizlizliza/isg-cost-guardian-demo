import { db } from "../db";
import type { DashboardRecord, PipelineRecord, BOMRecord, ShouldCostParamRecord } from "../types";

export async function seedDemoData() {
  // ── Dashboard ──
  const dashboard: DashboardRecord[] = [
    // SR650 V4
    { platform: "SR650 V4", kpiType: "ACI_Index", value: 1.08, unit: "ratio", note: "vs target 1.00" },
    { platform: "SR650 V4", kpiType: "ACI", value: 754, unit: "$", note: "Actual Cost Index" },
    { platform: "SR650 V4", kpiType: "DCE", value: 820, unit: "$", note: "vs Prev $791" },
    { platform: "SR650 V4", kpiType: "CCE", value: 710, unit: "$", note: "Gap: $110" },
    { platform: "SR650 V4", kpiType: "PDCI", value: 115, unit: "index", note: "Quote coverage: 78%" },
    { platform: "SR650 V4", kpiType: "Gate", value: "Commit", unit: "text", note: "" },
    { platform: "SR650 V4", kpiType: "Volume", value: 48000, unit: "units", note: "" },
    { platform: "SR650 V4", kpiType: "Code", value: "Neptune", unit: "text", note: "" },
    { platform: "SR650 V4", kpiType: "FiscalYear", value: "FY2025", unit: "text", note: "" },
    { platform: "SR650 V4", kpiType: "Quote_Coverage", value: 78, unit: "%", note: "14/18 quoted" },
    { platform: "SR650 V4", kpiType: "NRE_Total", value: 1200000, unit: "$", note: "$25/unit amortized" },
    // SR630 V3
    { platform: "SR630 V3", kpiType: "ACI_Index", value: 0.98, unit: "ratio", note: "vs target 1.00" },
    { platform: "SR630 V3", kpiType: "ACI", value: 610, unit: "$", note: "Actual Cost Index" },
    { platform: "SR630 V3", kpiType: "DCE", value: 645, unit: "$", note: "vs Prev $618" },
    { platform: "SR630 V3", kpiType: "CCE", value: 598, unit: "$", note: "Gap: $47" },
    { platform: "SR630 V3", kpiType: "PDCI", value: 108, unit: "index", note: "Quote coverage: 100%" },
    { platform: "SR630 V3", kpiType: "Gate", value: "Development", unit: "text", note: "" },
    { platform: "SR630 V3", kpiType: "Volume", value: 32000, unit: "units", note: "" },
    { platform: "SR630 V3", kpiType: "Code", value: "Atlas", unit: "text", note: "" },
    { platform: "SR630 V3", kpiType: "FiscalYear", value: "FY2025", unit: "text", note: "" },
    { platform: "SR630 V3", kpiType: "Quote_Coverage", value: 100, unit: "%", note: "16/16 quoted" },
    { platform: "SR630 V3", kpiType: "NRE_Total", value: 850000, unit: "$", note: "$26.56/unit amortized" },
  ];

  // ── Pipeline ──
  const pipeline: PipelineRecord[] = [
    { platform: "SR650 V4", stage: 1, stageName: "Pre-Commit", date: "Jan 22", status: "done" },
    { platform: "SR650 V4", stage: 2, stageName: "Commit", date: "Jan 22", status: "done" },
    { platform: "SR650 V4", stage: 3, stageName: "Development", date: "Mar 13", status: "active" },
    { platform: "SR650 V4", stage: 4, stageName: "SUT", date: "Apr 5", status: "pending" },
    { platform: "SR650 V4", stage: 5, stageName: "Ship Support", date: "Jun 11", status: "pending" },
    { platform: "SR630 V3", stage: 1, stageName: "Pre-Commit", date: "Oct 15", status: "done" },
    { platform: "SR630 V3", stage: 2, stageName: "Commit", date: "Nov 8", status: "done" },
    { platform: "SR630 V3", stage: 3, stageName: "Development", date: "Feb 20", status: "done" },
    { platform: "SR630 V3", stage: 4, stageName: "SUT", date: "Apr 10", status: "active" },
    { platform: "SR630 V3", stage: 5, stageName: "Ship Support", date: "Jul 15", status: "pending" },
  ];

  // ── BOM ──
  const bom: BOMRecord[] = [
    // SR650 V4
    { platform: "SR650 V4", component: "Motherboard", category: "ECAD", dce: 498, quote: 508, ch1: 481, ch2: 470, material: "FR4", status: "At Risk", aiInsight: "Layer count reduction may save $15-20/unit" },
    { platform: "SR650 V4", component: "Chassis", category: "Mechanical", dce: 335, quote: 412, ch1: 358, ch2: 344, material: "Steel", status: "Blocked", aiInsight: "Tooling NRE can be amortized across platforms" },
    { platform: "SR650 V4", component: "DC-SCM", category: "Management", dce: 210, quote: null, ch1: 198, ch2: 192, material: "PCB", status: "At Risk", aiInsight: "Caliptra waiver precedent from SR650 V3" },
    { platform: "SR650 V4", component: "PCIe Riser", category: "Mechanical", dce: 142, quote: 161, ch1: 135, ch2: 130, material: "Steel/ECAD", status: "At Risk", aiInsight: "Volume aggregation with ISG Blade could cut 9-11%" },
    { platform: "SR650 V4", component: "Cable/Interconnect", category: "Mechanical", dce: 64, quote: 88, ch1: 61, ch2: 58, material: "Copper", status: "Blocked", aiInsight: "Re-source to Vendor C at $61 with updated routing" },
    { platform: "SR650 V4", component: "Storage Backplane", category: "ECAD", dce: 210, quote: 218, ch1: 205, ch2: 200, material: "FR4", status: "OK", aiInsight: "Minimal gap; on track for cost target" },
    { platform: "SR650 V4", component: "Cooling Fans", category: "Thermal", dce: 84, quote: 84, ch1: 82, ch2: 80, material: "Plastic/ECAD", status: "OK", aiInsight: "Thermal solution validated; no action needed" },
    { platform: "SR650 V4", component: "PSU", category: "Power", dce: 140, quote: 145, ch1: 137, ch2: 132, material: "ECAD", status: "OK", aiInsight: "Payment terms improvement potential" },
    { platform: "SR650 V4", component: "NIC (OCP)", category: "ECAD", dce: 182, quote: 184, ch1: 175, ch2: 170, material: "FR4", status: "OK", aiInsight: "OCP redesign vs. prior gen saved $12" },
    // SR630 V3
    { platform: "SR630 V3", component: "Motherboard", category: "ECAD", dce: 380, quote: 385, ch1: 370, ch2: 365, material: "FR4", status: "OK", aiInsight: "Mature design; cost stable" },
    { platform: "SR630 V3", component: "Chassis", category: "Mechanical", dce: 220, quote: 235, ch1: 215, ch2: 210, material: "Steel", status: "At Risk", aiInsight: "Vendor consolidation opportunity" },
    { platform: "SR630 V3", component: "PSU", category: "Power", dce: 110, quote: 112, ch1: 108, ch2: 105, material: "ECAD", status: "OK", aiInsight: "Shared platform PSU; cost competitive" },
    { platform: "SR630 V3", component: "Cooling Fans", category: "Thermal", dce: 65, quote: 65, ch1: 63, ch2: 60, material: "Plastic/ECAD", status: "OK", aiInsight: "Standard fan module; no gap" },
  ];

  // ── ShouldCost_Params ──
  const shouldcostParams: ShouldCostParamRecord[] = [];
  const commodities = [
    {
      id: "air-baffle",
      params: [
        ["Physical", "Length", 220, "mm"],
        ["Physical", "Width", 85, "mm"],
        ["Physical", "Thickness", 2.0, "mm"],
        ["Physical", "Vanes", 4, "count"],
        ["Material", "MaterialType", "SECC Steel", "", "SECC Steel;SPCC Steel;Aluminum 5052;Stainless 304"],
        ["Material", "SteelIndex", 0.82, "$/kg"],
        ["Material", "ScrapYield", 78, "%"],
        ["Material", "SurfaceTreatment", "Zinc coat (electro)", "", "None;Zinc coat (electro);E-coat;Powder coat;Anodize"],
        ["Mfg", "Location", "Shenzhen, China", "", "Shenzhen, China;Chengdu, China;Penang, Malaysia;Monterrey, Mexico"],
        ["Mfg", "LaborRate", 4.2, "$/hr"],
        ["Mfg", "AssemblySteps", 6, "steps"],
        ["Mfg", "CycleTime", 0.8, "min"],
        ["Mfg", "FPY", 94, "%"],
        ["Mfg", "Depreciation", 0.18, "$/unit"],
        ["Mfg", "TestTime", 0, "min"],
        ["Logistics", "Destination", "ISG Assembly — Shenzhen", "", "ISG Assembly — Shenzhen;ISG Assembly — Hungary;ISG Assembly — Mexico"],
        ["Logistics", "ShippingMode", "Sea freight", "", "Sea freight;Air freight;Intermodal"],
        ["Logistics", "TariffRate", 7.5, "%"],
        ["Logistics", "LeadTime", 8, "weeks"],
        ["Logistics", "InboundFreight", 0.18, "$/unit"],
        ["Logistics", "OutboundFreight", 0.22, "$/unit"],
        ["Tooling", "ToolingType", "Progressive die stamp", "", "Progressive die stamp;Transfer die;Injection mold;Fabricated"],
        ["Tooling", "NRETotal", 38000, "$"],
        ["Tooling", "PriorGenReuse", 60, "%"],
        ["Tooling", "AmortizationVolume", 48000, "units"],
        ["Tooling", "ECAdder", 0.05, "$/unit"],
        ["Adders", "EORate", 1.0, "%"],
        ["Adders", "WarrantyRate", 8.0, "%"],
        ["Adders", "MarginRate", 14.3, "%"],
        ["Commercial", "VolumeTier", "Tier 2 (25K-75K)", ""],
        ["Commercial", "VolumeDiscount", 3.2, "%"],
        ["Commercial", "PaymentTerms", "Net 60", "", "Net 30;Net 60;Net 90"],
        ["Commercial", "PaymentAdder", 0.8, "%"],
      ],
    },
    {
      id: "top-cover",
      params: [
        ["Physical", "Length", 430, "mm"],
        ["Physical", "Width", 280, "mm"],
        ["Physical", "Thickness", 1.5, "mm"],
        ["Physical", "Cutout", 18, "%"],
        ["Material", "MaterialType", "SECC Steel", "", "SECC Steel;SPCC Steel;Aluminum 5052;Stainless 304"],
        ["Material", "SteelIndex", 0.82, "$/kg"],
        ["Material", "ScrapYield", 72, "%"],
        ["Material", "SurfaceTreatment", "E-coat", "", "None;Zinc coat (electro);E-coat;Powder coat;Anodize"],
        ["Mfg", "Location", "Shenzhen, China", "", "Shenzhen, China;Chengdu, China;Penang, Malaysia;Monterrey, Mexico"],
        ["Mfg", "LaborRate", 4.2, "$/hr"],
        ["Mfg", "AssemblySteps", 8, "steps"],
        ["Mfg", "CycleTime", 1.1, "min"],
        ["Mfg", "FPY", 92, "%"],
        ["Mfg", "Depreciation", 0.25, "$/unit"],
        ["Mfg", "TestTime", 0, "min"],
        ["Logistics", "Destination", "ISG Assembly — Shenzhen", "", "ISG Assembly — Shenzhen;ISG Assembly — Hungary;ISG Assembly — Mexico"],
        ["Logistics", "ShippingMode", "Sea freight", "", "Sea freight;Air freight;Intermodal"],
        ["Logistics", "TariffRate", 7.5, "%"],
        ["Logistics", "LeadTime", 10, "weeks"],
        ["Logistics", "InboundFreight", 0.18, "$/unit"],
        ["Logistics", "OutboundFreight", 0.22, "$/unit"],
        ["Tooling", "ToolingType", "Progressive die stamp", "", "Progressive die stamp;Transfer die;Injection mold;Fabricated"],
        ["Tooling", "NRETotal", 65000, "$"],
        ["Tooling", "PriorGenReuse", 55, "%"],
        ["Tooling", "AmortizationVolume", 48000, "units"],
        ["Tooling", "ECAdder", 0.08, "$/unit"],
        ["Adders", "EORate", 1.0, "%"],
        ["Adders", "WarrantyRate", 8.0, "%"],
        ["Adders", "MarginRate", 14.3, "%"],
        ["Commercial", "VolumeTier", "Tier 2 (25K-75K)", ""],
        ["Commercial", "VolumeDiscount", 3.2, "%"],
        ["Commercial", "PaymentTerms", "Net 60", "", "Net 30;Net 60;Net 90"],
        ["Commercial", "PaymentAdder", 0.8, "%"],
      ],
    },
    {
      id: "riser-cage",
      params: [
        ["Physical", "Length", 110, "mm"],
        ["Physical", "Width", 155, "mm"],
        ["Physical", "Thickness", 2.0, "mm"],
        ["Physical", "Depth", 68, "mm"],
        ["Physical", "MountingHoles", 8, ""],
        ["Physical", "SlotCount", 2, ""],
        ["Material", "MaterialType", "SPCC Steel", "", "SECC Steel;SPCC Steel;Aluminum 5052;Stainless 304"],
        ["Material", "SteelIndex", 0.82, "$/kg"],
        ["Material", "ScrapYield", 70, "%"],
        ["Material", "SurfaceTreatment", "Zinc coat (electro)", "", "None;Zinc coat (electro);E-coat;Powder coat;Anodize"],
        ["Mfg", "Location", "Shenzhen, China", "", "Shenzhen, China;Chengdu, China;Penang, Malaysia;Monterrey, Mexico"],
        ["Mfg", "LaborRate", 4.2, "$/hr"],
        ["Mfg", "AssemblySteps", 14, "steps"],
        ["Mfg", "CycleTime", 1.2, "min"],
        ["Mfg", "FPY", 90, "%"],
        ["Mfg", "Depreciation", 0.35, "$/unit"],
        ["Mfg", "TestTime", 2.5, "min"],
        ["Logistics", "Destination", "ISG Assembly — Shenzhen", "", "ISG Assembly — Shenzhen;ISG Assembly — Hungary;ISG Assembly — Mexico"],
        ["Logistics", "ShippingMode", "Sea freight", "", "Sea freight;Air freight;Intermodal"],
        ["Logistics", "TariffRate", 7.5, "%"],
        ["Logistics", "LeadTime", 12, "weeks"],
        ["Logistics", "InboundFreight", 0.45, "$/unit"],
        ["Logistics", "OutboundFreight", 0.55, "$/unit"],
        ["Tooling", "ToolingType", "Transfer die", "", "Progressive die stamp;Transfer die;Injection mold;Fabricated"],
        ["Tooling", "NRETotal", 85000, "$"],
        ["Tooling", "PriorGenReuse", 45, "%"],
        ["Tooling", "AmortizationVolume", 48000, "units"],
        ["Tooling", "ECAdder", 0.12, "$/unit"],
        ["Adders", "EORate", 1.0, "%"],
        ["Adders", "WarrantyRate", 8.0, "%"],
        ["Adders", "MarginRate", 14.3, "%"],
        ["Commercial", "VolumeTier", "Tier 2 (25K-75K)", ""],
        ["Commercial", "VolumeDiscount", 3.2, "%"],
        ["Commercial", "PaymentTerms", "Net 60", "", "Net 30;Net 60;Net 90"],
        ["Commercial", "PaymentAdder", 0.8, "%"],
      ],
    },
  ];

  for (const platform of ["SR650 V4", "SR630 V3"]) {
    for (const com of commodities) {
      for (const p of com.params) {
        shouldcostParams.push({
          platform,
          commodity: com.id,
          paramCategory: p[0] as string,
          paramName: p[1] as string,
          value: p[2],
          unit: p[3] as string,
          options: (p[4] as string) || undefined,
        });
      }
    }
  }

  await Promise.all([
    db.dashboard.bulkAdd(dashboard),
    db.pipeline.bulkAdd(pipeline),
    db.bom.bulkAdd(bom),
    db.shouldcostParams.bulkAdd(shouldcostParams),
  ]);
}
