import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { db } from "../db";
import type {
  DashboardRecord,
  PipelineRecord,
  BOMRecord,
  ShouldCostParamRecord,
  UploadMeta,
  ActivityLogEntry,
  ActivityAction,
} from "../types";
import { seedDemoData } from "../data/seedData";

interface DataContextType {
  // Data stores
  dashboard: DashboardRecord[];
  pipeline: PipelineRecord[];
  bom: BOMRecord[];
  shouldcostParams: ShouldCostParamRecord[];
  uploadMeta: UploadMeta[];
  activityLog: ActivityLogEntry[];

  // Platform
  platform: string;
  setPlatform: (p: string) => void;

  // Web editing toggle
  webEditingEnabled: boolean;
  setWebEditingEnabled: (v: boolean) => void;

  // Actions
  refreshAll: () => Promise<void>;
  loadFromExcel: (records: {
    dashboard: DashboardRecord[];
    pipeline: PipelineRecord[];
    bom: BOMRecord[];
    shouldcostParams: ShouldCostParamRecord[];
  }, fileName: string, user: string) => Promise<void>;
  updateBOMField: (id: number, field: string, oldValue: number, newValue: number, user: string) => Promise<void>;
  updateShouldCostParam: (id: number, paramName: string, oldValue: number | string, newValue: number | string, user: string) => Promise<void>;
  addActivity: (user: string, action: ActivityAction, detail: string, source: string) => Promise<void>;
  resetToDemo: () => Promise<void>;
  exportCurrentData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [platform, setPlatform] = useState("SR650 V4");
  const [webEditingEnabled, setWebEditingEnabled] = useState(false);

  const [dashboard, setDashboard] = useState<DashboardRecord[]>([]);
  const [pipeline, setPipeline] = useState<PipelineRecord[]>([]);
  const [bom, setBom] = useState<BOMRecord[]>([]);
  const [shouldcostParams, setShouldcostParams] = useState<ShouldCostParamRecord[]>([]);
  const [uploadMeta, setUploadMeta] = useState<UploadMeta[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);

  const refreshAll = useCallback(async () => {
    const [d, p, b, s, u, a] = await Promise.all([
      db.dashboard.toArray(),
      db.pipeline.toArray(),
      db.bom.toArray(),
      db.shouldcostParams.toArray(),
      db.uploadMeta.orderBy("uploadedAt").reverse().toArray(),
      db.activityLog.orderBy("timestamp").reverse().toArray(),
    ]);
    setDashboard(d);
    setPipeline(p);
    setBom(b);
    setShouldcostParams(s);
    setUploadMeta(u);
    setActivityLog(a);
  }, []);

  const addActivity = useCallback(async (
    user: string,
    action: ActivityAction,
    detail: string,
    source: string,
  ) => {
    const entry: ActivityLogEntry = {
      timestamp: new Date().toISOString(),
      user,
      action,
      detail,
      source,
    };
    await db.activityLog.add(entry);
    setActivityLog((prev) => [entry, ...prev]);
  }, []);

  const loadFromExcel = useCallback(async (
    records: {
      dashboard: DashboardRecord[];
      pipeline: PipelineRecord[];
      bom: BOMRecord[];
      shouldcostParams: ShouldCostParamRecord[];
    },
    fileName: string,
    user: string,
  ) => {
    await Promise.all([
      db.dashboard.clear(),
      db.pipeline.clear(),
      db.bom.clear(),
      db.shouldcostParams.clear(),
    ]);
    await Promise.all([
      db.dashboard.bulkAdd(records.dashboard),
      db.pipeline.bulkAdd(records.pipeline),
      db.bom.bulkAdd(records.bom),
      db.shouldcostParams.bulkAdd(records.shouldcostParams),
    ]);

    const sheets = [
      { name: "Dashboard", rows: records.dashboard.length },
      { name: "Pipeline", rows: records.pipeline.length },
      { name: "BOM", rows: records.bom.length },
      { name: "ShouldCost_Params", rows: records.shouldcostParams.length },
    ];

    await db.uploadMeta.add({
      fileName,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user,
      sheets,
      totalRows: sheets.reduce((sum, s) => sum + s.rows, 0),
    });

    await addActivity(
      user,
      "Upload",
      `${sheets.reduce((sum, s) => sum + s.rows, 0)} records, ${sheets.length} sheets`,
      "Admin"
    );

    await refreshAll();
  }, [addActivity, refreshAll]);

  const updateBOMField = useCallback(async (
    id: number,
    field: string,
    oldValue: number,
    newValue: number,
    user: string,
  ) => {
    if (!webEditingEnabled) return;
    await db.bom.update(id, { [field]: newValue } as Partial<BOMRecord>);
    await addActivity(user, "Edit", `${field}: ${oldValue}→${newValue}`, "Dashboard");
    await refreshAll();
  }, [webEditingEnabled, addActivity, refreshAll]);

  const updateShouldCostParam = useCallback(async (
    id: number,
    paramName: string,
    oldValue: number | string,
    newValue: number | string,
    user: string,
  ) => {
    if (!webEditingEnabled) return;
    await db.shouldcostParams.update(id, { value: newValue } as Partial<ShouldCostParamRecord>);
    await addActivity(user, "Edit", `${paramName}: ${oldValue}→${newValue}`, "SCC");
  }, [webEditingEnabled, addActivity]);

  const resetToDemo = useCallback(async () => {
    await Promise.all([
      db.dashboard.clear(),
      db.pipeline.clear(),
      db.bom.clear(),
      db.shouldcostParams.clear(),
      db.uploadMeta.clear(),
    ]);
    await seedDemoData();
    await addActivity("System", "Reset", "Restored demo data (SR650 V4 + SR630 V3)", "Admin");
    await refreshAll();
  }, [addActivity, refreshAll]);

  const exportCurrentData = useCallback(async () => {
    const [d, p, b, s] = await Promise.all([
      db.dashboard.toArray(),
      db.pipeline.toArray(),
      db.bom.toArray(),
      db.shouldcostParams.toArray(),
    ]);
    const allData = {
      dashboard: d,
      pipeline: p,
      bom: b,
      shouldcostParams: s,
    };
    const json = JSON.stringify(allData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cost-guardian-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Seed demo data on first launch
  useEffect(() => {
    (async () => {
      const count = await db.dashboard.count();
      if (count === 0) {
        await seedDemoData();
      }
      await refreshAll();
    })();
  }, [refreshAll]);

  return (
    <DataContext.Provider
      value={{
        dashboard,
        pipeline,
        bom,
        shouldcostParams,
        uploadMeta,
        activityLog,
        platform,
        setPlatform,
        webEditingEnabled,
        setWebEditingEnabled,
        refreshAll,
        loadFromExcel,
        updateBOMField,
        updateShouldCostParam,
        addActivity,
        resetToDemo,
        exportCurrentData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
