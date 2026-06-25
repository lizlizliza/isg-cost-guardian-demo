import Dexie, { type Table } from "dexie";
import type {
  DashboardRecord,
  PipelineRecord,
  BOMRecord,
  ShouldCostParamRecord,
  UploadMeta,
  ActivityLogEntry,
} from "../types";

export class CostGuardianDB extends Dexie {
  dashboard!: Table<DashboardRecord, number>;
  pipeline!: Table<PipelineRecord, number>;
  bom!: Table<BOMRecord, number>;
  shouldcostParams!: Table<ShouldCostParamRecord, number>;
  uploadMeta!: Table<UploadMeta, number>;
  activityLog!: Table<ActivityLogEntry, number>;

  constructor() {
    super("CostGuardianDB");
    this.version(1).stores({
      dashboard: "++id, [platform+kpiType]",
      pipeline: "++id, [platform+stage]",
      bom: "++id, [platform+component]",
      shouldcostParams: "++id, [platform+commodity+paramCategory]",
      uploadMeta: "++id, uploadedAt",
      activityLog: "++id, timestamp",
    });
  }
}

export const db = new CostGuardianDB();
