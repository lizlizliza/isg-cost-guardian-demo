import * as XLSX from "xlsx";
import type { DashboardRecord, PipelineRecord, BOMRecord, ShouldCostParamRecord } from "../types";

export interface ParsedExcel {
  dashboard: DashboardRecord[];
  pipeline: PipelineRecord[];
  bom: BOMRecord[];
  shouldcostParams: ShouldCostParamRecord[];
}

export interface ValidationIssue {
  sheet: string;
  row: number;
  field: string;
  issue: string;
}

export interface ValidationResult {
  sheets: { name: string; rows: number; status: "ok" | "warn" | "error"; issues: string[] }[];
  records: ParsedExcel;
  issues: ValidationIssue[];
}

export function parseExcelFile(file: File): Promise<ValidationResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const result = validateAndParse(workbook);
        resolve(result);
      } catch (err) {
        reject(new Error(`Failed to parse Excel: ${err instanceof Error ? err.message : String(err)}`));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

function validateAndParse(workbook: XLSX.WorkBook): ValidationResult {
  const expectedSheets = ["Dashboard", "Pipeline", "BOM", "ShouldCost_Params"];
  const issues: ValidationIssue[] = [];
  const sheets: { name: string; rows: number; status: "ok" | "warn" | "error"; issues: string[] }[] = [];

  const getSheet = (name: string): XLSX.WorkSheet | undefined => {
    return workbook.Sheets[name] || workbook.Sheets[name.toLowerCase()];
  };

  for (const sheetName of expectedSheets) {
    const ws = getSheet(sheetName);
    if (!ws) {
      sheets.push({ name: sheetName, rows: 0, status: "error", issues: ["Sheet missing"] });
      continue;
    }
    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(ws, { defval: null });
    const sheetIssues: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] as Record<string, unknown>;
      switch (sheetName) {
        case "Dashboard": {
          if (!row["Platform"]) { sheetIssues.push(`Row ${i + 2}: missing Platform`); issues.push({ sheet: sheetName, row: i + 2, field: "Platform", issue: "Missing Platform" }); }
          if (!row["KPI_Type"]) { sheetIssues.push(`Row ${i + 2}: missing KPI_Type`); issues.push({ sheet: sheetName, row: i + 2, field: "KPI_Type", issue: "Missing KPI_Type" }); }
          if (row["Value"] === null || row["Value"] === undefined) { sheetIssues.push(`Row ${i + 2}: missing Value`); issues.push({ sheet: sheetName, row: i + 2, field: "Value", issue: "Missing Value" }); }
          break;
        }
        case "Pipeline": {
          if (!row["Platform"]) sheetIssues.push(`Row ${i + 2}: missing Platform`);
          if (row["Stage"] === null || row["Stage"] === undefined) sheetIssues.push(`Row ${i + 2}: missing Stage`);
          break;
        }
        case "BOM": {
          if (!row["Platform"]) sheetIssues.push(`Row ${i + 2}: missing Platform`);
          if (!row["Component"]) sheetIssues.push(`Row ${i + 2}: missing Component`);
          if (row["DCE"] === null || row["DCE"] === undefined) sheetIssues.push(`Row ${i + 2}: missing DCE`);
          break;
        }
      }
    }

    const status = sheetIssues.length === 0 ? "ok" : "warn";
    sheets.push({ name: sheetName, rows: rows.length, status, issues: sheetIssues });
  }

  // Parse records
  const dashboardWs = getSheet("Dashboard");
  const pipelineWs = getSheet("Pipeline");
  const bomWs = getSheet("BOM");
  const shouldcostWs = getSheet("ShouldCost_Params");

  const dashboard: DashboardRecord[] = dashboardWs
    ? XLSX.utils.sheet_to_json<Record<string, unknown>>(dashboardWs).map((r) => ({
        platform: String(r["Platform"] ?? ""),
        kpiType: String(r["KPI_Type"] ?? ""),
        value: r["Value"] as number | string,
        unit: String(r["Unit"] ?? ""),
        note: r["Note"] ? String(r["Note"]) : undefined,
      }))
    : [];

  const pipeline: PipelineRecord[] = pipelineWs
    ? XLSX.utils.sheet_to_json<Record<string, unknown>>(pipelineWs).map((r) => ({
        platform: String(r["Platform"] ?? ""),
        stage: Number(r["Stage"] ?? 0),
        stageName: String(r["StageName"] ?? ""),
        date: String(r["Date"] ?? ""),
        status: (r["Status"] as PipelineRecord["status"]) || "pending",
      }))
    : [];

  const bomRecords: BOMRecord[] = bomWs
    ? XLSX.utils.sheet_to_json<Record<string, unknown>>(bomWs).map((r) => ({
        platform: String(r["Platform"] ?? ""),
        component: String(r["Component"] ?? ""),
        category: String(r["Category"] ?? ""),
        dce: Number(r["DCE"] ?? 0),
        quote: r["Quote"] != null ? Number(r["Quote"]) : null,
        ch1: Number(r["Ch1"] ?? 0),
        ch2: Number(r["Ch2"] ?? 0),
        material: String(r["Material"] ?? ""),
        status: String(r["Status"] ?? ""),
        aiInsight: String(r["AI_Insight"] ?? ""),
      }))
    : [];

  const shouldcostParams: ShouldCostParamRecord[] = shouldcostWs
    ? XLSX.utils.sheet_to_json<Record<string, unknown>>(shouldcostWs).map((r) => ({
        platform: String(r["Platform"] ?? ""),
        commodity: String(r["Commodity"] ?? ""),
        paramCategory: String(r["ParamCategory"] ?? ""),
        paramName: String(r["ParamName"] ?? ""),
        value: r["Value"] as number | string,
        unit: String(r["Unit"] ?? ""),
        options: r["Options"] ? String(r["Options"]) : undefined,
      }))
    : [];

  return {
    sheets,
    records: { dashboard, pipeline, bom: bomRecords, shouldcostParams },
    issues,
  };
}

export function generateExcelExport(
  data: {
    dashboard: DashboardRecord[];
    pipeline: PipelineRecord[];
    bom: BOMRecord[];
    shouldcostParams: ShouldCostParamRecord[];
  },
  sheetNames: string[] = ["Dashboard", "Pipeline", "BOM", "ShouldCost_Params"],
): Uint8Array {
  const wb = XLSX.utils.book_new();

  if (sheetNames.includes("Dashboard") && data.dashboard.length > 0) {
    const ws = XLSX.utils.json_to_sheet(
      data.dashboard.map((d) => ({ Platform: d.platform, KPI_Type: d.kpiType, Value: d.value, Unit: d.unit, Note: d.note || "" }))
    );
    XLSX.utils.book_append_sheet(wb, ws, "Dashboard");
  }

  if (sheetNames.includes("Pipeline") && data.pipeline.length > 0) {
    const ws = XLSX.utils.json_to_sheet(
      data.pipeline.map((p) => ({ Platform: p.platform, Stage: p.stage, StageName: p.stageName, Date: p.date, Status: p.status }))
    );
    XLSX.utils.book_append_sheet(wb, ws, "Pipeline");
  }

  if (sheetNames.includes("BOM") && data.bom.length > 0) {
    const ws = XLSX.utils.json_to_sheet(
      data.bom.map((b) => ({
        Platform: b.platform, Component: b.component, Category: b.category,
        DCE: b.dce, Quote: b.quote, Ch1: b.ch1, Ch2: b.ch2,
        Material: b.material, Status: b.status, AI_Insight: b.aiInsight,
      }))
    );
    XLSX.utils.book_append_sheet(wb, ws, "BOM");
  }

  if (sheetNames.includes("ShouldCost_Params") && data.shouldcostParams.length > 0) {
    const ws = XLSX.utils.json_to_sheet(
      data.shouldcostParams.map((s) => ({
        Platform: s.platform, Commodity: s.commodity, ParamCategory: s.paramCategory,
        ParamName: s.paramName, Value: s.value, Unit: s.unit, Options: s.options || "",
      }))
    );
    XLSX.utils.book_append_sheet(wb, ws, "ShouldCost_Params");
  }

  return XLSX.write(wb, { type: "array", bookType: "xlsx" });
}

export function generateTemplateExcel(): Uint8Array {
  const wb = XLSX.utils.book_new();

  // ── Readme sheet ──
  const readmeRows: (string | number)[][] = [
    ["Cost Guardian — 数据上传模板说明"],
    [""],
    ["本文件包含 4 个数据 Sheet。修改数据前请仔细阅读以下说明。"],
    [""],
    ["═══ 概览 ═══", ""],
    ["Sheet 名称", "对应页面", "必填", "说明"],
    ["Dashboard", "Program Dashboard", "✅", "KPI 指标：ACI/DCE/CCE/Volume/Gate 等，每个平台 11 行"],
    ["Pipeline", "Program Dashboard → PLP Pipeline", "✅", "5 阶段流水线：Pre-Commit→Commit→Development→SUT→Ship Support"],
    ["BOM", "L2 BOM Analysis", "✅", "L2 物料清单，每个组件一行"],
    ["ShouldCost_Params", "Should Cost Calculator", "否", "Should-cost 模型参数（可选上传，系统有内置默认值）"],
    [""],
    ["═══ 通用规则 ═══", ""],
    ["1. Platform 列只能填 SR650 V4 或 SR630 V3", ""],
    ["2. 列名行（第 1 行）不可删除或改名", ""],
    ["3. 数值列填纯数字，不要带 $ 或 % 符号", ""],
    ["4. 空 Sheet 上传时不会覆盖已有数据；非空 Sheet 会先清空再导入", ""],
    [""],
    ["═══ Dashboard KPI_Type 取值 ═══", ""],
    ["ACI_Index", "数字, 如 1.08", "实际成本指数 (ratio)"],
    ["ACI", "数字, 如 754", "实际成本金额 ($)"],
    ["DCE", "数字, 如 820", "设计成本估算 ($)"],
    ["CCE", "数字, 如 710", "当前成本估算 ($)"],
    ["PDCI", "数字, 如 115", "采购成本指数"],
    ["Gate", "文本, 如 Commit", "当前阶段名（实际从 Pipeline 的 active 阶段推导）"],
    ["Volume", "数字, 如 48000", "项目总出货量 (units)"],
    ["Code", "文本, 如 Neptune", "内部项目代号"],
    ["FiscalYear", "文本, 如 FY2025", "财年"],
    ["Quote_Coverage", "数字, 如 78", "报价覆盖率 (%)"],
    ["NRE_Total", "数字, 如 1200000", "NRE 总费用 ($)"],
    [""],
    ["═══ Pipeline Status 取值 ═══", ""],
    ["done", "已完成", "箭头显示蓝色"],
    ["active", "当前阶段", "箭头显示深蓝 + 发光（每个平台有且仅有一个 active）"],
    ["pending", "未到达", "箭头显示灰色"],
    [""],
    ["═══ BOM Status 取值 ═══", ""],
    ["OK", "绿色 — 成本达标", ""],
    ["At Risk", "红色 — 成本有风险", ""],
    ["Blocked", "琥珀色 — 成本阻塞", ""],
    [""],
    ["═══ ShouldCost_Params Commodity 取值 ═══", ""],
    ["air-baffle", "Air Baffle（散热挡板）", "Mechanical"],
    ["top-cover", "Top Cover（机箱顶盖）", "Mechanical"],
    ["riser-cage", "Riser Cage（PCIe 扩展笼）", "Mechanical + ECAD"],
  ];
  const readmeWs = XLSX.utils.aoa_to_sheet(readmeRows);
  readmeWs["!cols"] = [{ wch: 22 }, { wch: 40 }, { wch: 12 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, readmeWs, "使用说明 Readme");

  // ── Dashboard sheet ──
  const dashRows = [
    ["Platform*", "KPI_Type*", "Value*", "Unit", "Note"],
    ["SR650 V4", "ACI_Index", 1.08, "ratio", "vs target 1.00"],
    ["SR650 V4", "ACI", 754, "$", "Actual Cost Index"],
    ["SR650 V4", "DCE", 820, "$", "vs Prev Gen $791"],
    ["SR650 V4", "CCE", 710, "$", "Gap: $110"],
    ["SR650 V4", "PDCI", 115, "index", "Quote coverage: 78%"],
    ["SR650 V4", "Gate", "Commit", "text", ""],
    ["SR650 V4", "Volume", 48000, "units", ""],
    ["SR650 V4", "Code", "Neptune", "text", ""],
    ["SR650 V4", "FiscalYear", "FY2025", "text", ""],
    ["SR650 V4", "Quote_Coverage", 78, "%", "14 of 18 quoted"],
    ["SR650 V4", "NRE_Total", 1200000, "$", "$25/unit amortized"],
    ["SR630 V3", "ACI_Index", 0.98, "ratio", "vs target 1.00"],
    ["SR630 V3", "ACI", 610, "$", "Actual Cost Index"],
    ["SR630 V3", "DCE", 645, "$", "vs Prev Gen $618"],
    ["SR630 V3", "CCE", 598, "$", "Gap: $47"],
    ["SR630 V3", "PDCI", 108, "index", "Quote coverage: 100%"],
    ["SR630 V3", "Gate", "Development", "text", ""],
    ["SR630 V3", "Volume", 32000, "units", ""],
    ["SR630 V3", "Code", "Atlas", "text", ""],
    ["SR630 V3", "FiscalYear", "FY2025", "text", ""],
    ["SR630 V3", "Quote_Coverage", 100, "%", "16 of 16 quoted"],
    ["SR630 V3", "NRE_Total", 850000, "$", "$26.56/unit amortized"],
  ];
  const dashWs = XLSX.utils.aoa_to_sheet(dashRows);
  dashWs["!cols"] = [{ wch: 14 }, { wch: 18 }, { wch: 12 }, { wch: 10 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, dashWs, "Dashboard");

  // ── Pipeline sheet ──
  const pipeRows = [
    ["Platform*", "Stage*", "StageName*", "Date", "Status*"],
    ["SR650 V4", 1, "Pre-Commit", "Jan 22", "done"],
    ["SR650 V4", 2, "Commit", "Jan 22", "done"],
    ["SR650 V4", 3, "Development", "Mar 13", "active"],
    ["SR650 V4", 4, "SUT", "Apr 5", "pending"],
    ["SR650 V4", 5, "Ship Support", "Jun 11", "pending"],
    ["SR630 V3", 1, "Pre-Commit", "Oct 15", "done"],
    ["SR630 V3", 2, "Commit", "Nov 8", "done"],
    ["SR630 V3", 3, "Development", "Feb 20", "done"],
    ["SR630 V3", 4, "SUT", "Apr 10", "active"],
    ["SR630 V3", 5, "Ship Support", "Jul 15", "pending"],
  ];
  const pipeWs = XLSX.utils.aoa_to_sheet(pipeRows);
  pipeWs["!cols"] = [{ wch: 14 }, { wch: 8 }, { wch: 18 }, { wch: 12 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, pipeWs, "Pipeline");

  // ── BOM sheet ──
  const bomRows = [
    ["Platform*", "Component*", "Category", "DCE*", "Quote", "Ch1", "Ch2", "Material", "Status", "AI_Insight"],
    ["SR650 V4", "Motherboard", "ECAD", 498, 508, 481, 470, "FR4", "At Risk", "Layer count reduction may save $15-20/unit"],
    ["SR650 V4", "Chassis", "Mechanical", 335, 412, 358, 344, "Steel", "Blocked", "Tooling NRE can be amortized across platforms"],
    ["SR650 V4", "DC-SCM", "Management", 210, null, 198, 192, "PCB", "At Risk", "Caliptra waiver precedent from SR650 V3"],
    ["SR650 V4", "PCIe Riser", "Mechanical", 142, 161, 135, 130, "Steel/ECAD", "At Risk", "Volume aggregation with ISG Blade could cut 9-11%"],
    ["SR650 V4", "Cable/Interconnect", "Mechanical", 64, 88, 61, 58, "Copper", "Blocked", "Re-source to Vendor C at $61 with updated routing"],
    ["SR650 V4", "Storage Backplane", "ECAD", 210, 218, 205, 200, "FR4", "OK", "Minimal gap; on track for cost target"],
    ["SR650 V4", "Cooling Fans", "Thermal", 84, 84, 82, 80, "Plastic/ECAD", "OK", "Thermal solution validated; no action needed"],
    ["SR650 V4", "PSU", "Power", 140, 145, 137, 132, "ECAD", "OK", "Payment terms improvement potential"],
    ["SR650 V4", "NIC (OCP)", "ECAD", 182, 184, 175, 170, "FR4", "OK", "OCP redesign vs. prior gen saved $12"],
    ["SR630 V3", "Motherboard", "ECAD", 380, 385, 370, 365, "FR4", "OK", "Mature design; cost stable"],
  ];
  const bomWs = XLSX.utils.aoa_to_sheet(bomRows);
  bomWs["!cols"] = [{ wch: 14 }, { wch: 20 }, { wch: 14 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 14 }, { wch: 12 }, { wch: 48 }];
  XLSX.utils.book_append_sheet(wb, bomWs, "BOM");

  // ── ShouldCost_Params sheet ──
  const scRows = [
    ["Platform*", "Commodity*", "ParamCategory*", "ParamName*", "Value*", "Unit", "Options"],
    ["SR650 V4", "air-baffle", "Physical", "Length", 220, "mm", ""],
    ["SR650 V4", "air-baffle", "Physical", "Width", 85, "mm", ""],
    ["SR650 V4", "air-baffle", "Physical", "Thickness", 2, "mm", ""],
    ["SR650 V4", "air-baffle", "Physical", "Vanes Count", 4, "", ""],
    ["SR650 V4", "air-baffle", "Material", "Material Type", "SECC Steel", "", "SECC Steel, SPCC Steel, Aluminum 5052, Stainless 304"],
    ["SR650 V4", "air-baffle", "Material", "Steel Index", 0.82, "$/kg", ""],
    ["SR650 V4", "air-baffle", "Material", "Scrap Yield", 78, "%", ""],
    ["SR650 V4", "air-baffle", "Material", "Surface Treatment", "Zinc coat (electro)", "", "None, Zinc coat (electro), E-coat, Powder coat, Anodize"],
    ["SR650 V4", "air-baffle", "Manufacturing", "Location", "Shenzhen, China", "", "Shenzhen China, Chengdu China, Penang Malaysia, Monterrey Mexico"],
    ["SR650 V4", "air-baffle", "Manufacturing", "Labor Rate", 4.2, "$/hr", ""],
    ["SR650 V4", "air-baffle", "Manufacturing", "Assembly Steps", 6, "", ""],
    ["SR650 V4", "air-baffle", "Manufacturing", "Cycle Time per Step", 0.8, "min", ""],
    ["SR650 V4", "air-baffle", "Manufacturing", "First Pass Yield", 94, "%", ""],
    ["SR650 V4", "air-baffle", "Manufacturing", "Machine Depreciation", 0.18, "$/u", ""],
    ["SR650 V4", "air-baffle", "Manufacturing", "Test Time", 0, "min", ""],
    ["SR650 V4", "air-baffle", "Logistics", "Destination", "ISG Assembly — Shenzhen", "", "ISG Assembly — Shenzhen, ISG Assembly — Hungary, ISG Assembly — Mexico"],
    ["SR650 V4", "air-baffle", "Logistics", "Shipping Mode", "Sea freight", "", "Sea freight, Air freight, Intermodal"],
    ["SR650 V4", "air-baffle", "Logistics", "Tariff Rate", 7.5, "%", ""],
    ["SR650 V4", "air-baffle", "Logistics", "Lead Time", 8, "weeks", ""],
    ["SR650 V4", "air-baffle", "Tooling", "Tooling Type", "Progressive die stamp", "", "Progressive die stamp, Transfer die, Injection mold, Fabricated"],
    ["SR650 V4", "air-baffle", "Tooling", "NRE Total", 38000, "$", ""],
    ["SR650 V4", "air-baffle", "Tooling", "Prior Gen Reuse", 60, "%", ""],
    ["SR650 V4", "air-baffle", "Tooling", "Amortization Volume", 48000, "units", ""],
    ["SR650 V4", "air-baffle", "Tooling", "ECA Adder", 0.05, "$/u", ""],
    ["SR650 V4", "air-baffle", "Commercial", "Program Volume", 48000, "units", ""],
    ["SR650 V4", "air-baffle", "Commercial", "MOQ Basis", "Lifecycle volume", "", "MOQ only, Annual volume, Lifecycle volume"],
    ["SR650 V4", "air-baffle", "Commercial", "Payment Terms", "Net 60", "", "Net 30, Net 60, Net 90"],
    ["SR650 V4", "air-baffle", "Commercial", "E&O Reserve Rate", 1.3, "%", ""],
    ["SR650 V4", "air-baffle", "Commercial", "Warranty Adder", 0.45, "$/u", ""],
  ];
  const scWs = XLSX.utils.aoa_to_sheet(scRows);
  scWs["!cols"] = [{ wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 22 }, { wch: 14 }, { wch: 10 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, scWs, "ShouldCost_Params");

  return XLSX.write(wb, { type: "array", bookType: "xlsx" });
}

export function downloadExcel(data: Uint8Array, fileName: string) {
  const blob = new Blob([data as BlobPart], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
