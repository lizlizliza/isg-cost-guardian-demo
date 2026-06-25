import { useState, useRef, type DragEvent } from "react";
import { Download, Upload, FileSpreadsheet, RotateCcw, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useData } from "../../context/DataContext";
import { parseExcelFile, type ValidationResult, generateTemplateExcel, downloadExcel } from "../../utils/excel";
import type { AppUser } from "../../App";

interface AdminPageProps {
  currentUser: AppUser;
}

export default function AdminPage({ currentUser }: AdminPageProps) {
  const {
    platform, setPlatform,
    webEditingEnabled, setWebEditingEnabled,
    activityLog,
    loadFromExcel,
    resetToDemo,
    exportCurrentData,
    dashboard, pipeline, bom, shouldcostParams,
    uploadMeta,
    addActivity,
  } = useData();

  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingRecords, setPendingRecords] = useState<ValidationResult["records"] | null>(null);
  const [pendingFileName, setPendingFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Please upload a .xlsx or .xls file.");
      return;
    }
    setUploading(true);
    try {
      const result = await parseExcelFile(file);
      setValidation(result);
      setPendingRecords(result.records);
      setPendingFileName(file.name);
      setShowConfirm(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to parse file.");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmUpload = async () => {
    if (!pendingRecords) return;
    await loadFromExcel(pendingRecords, pendingFileName, currentUser.name);
    setShowConfirm(false);
    setValidation(null);
    setPendingRecords(null);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDownloadTemplate = async () => {
    const xlsx = generateTemplateExcel();
    downloadExcel(xlsx, "cost-guardian-template.xlsx");
    await addActivity(currentUser.name, "Export", "Downloaded blank template (4 sheets)", "Admin");
  };

  const handleDownloadCurrentData = async () => {
    await exportCurrentData();
    await addActivity(currentUser.name, "Export", "Full data backup", "Admin");
  };

  const handleDownloadUserGuide = () => {
    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Cost Guardian v2 — User Guide</title>
<style>body{font-family:Inter,system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 20px;color:#1e293b;line-height:1.7}h1{color:#2563EB;border-bottom:2px solid #e2e8f0;padding-bottom:8px}h2{color:#334155;margin-top:28px}h3{color:#475569}table{width:100%;border-collapse:collapse;margin:12px 0;font-size:13px}th,td{border:1px solid #e2e8f0;padding:8px 10px;text-align:left}th{background:#f8fafc;font-weight:600}code{background:#f1f5f9;padding:1px 4px;border-radius:3px;font-size:12px}ul{margin:8px 0;padding-left:20px}li{margin:4px 0}@media print{body{margin:0;padding:0}}</style></head>
<body><h1>Cost Guardian v2 — User Guide</h1>
<h2>Overview</h2><p>Cost Guardian is a cost governance platform for ISG hardware programs. It provides parametric should-cost modeling, BOM-level quote analysis, and cost bridge waterfall visualization — all running entirely in your browser with no backend server.</p>
<h2>Quick Start</h2><ol><li>Open the web app in a modern browser (Chrome, Edge, Firefox)</li><li>Select a platform from the dropdown (SR650 V4 or SR630 V3)</li><li>Navigate between pages using the header tabs or left sidebar</li></ol><p>Demo data for SR650 V4 and SR630 V3 is pre-loaded on first launch.</p>
<h2>Pages</h2>
<h3>Program Dashboard</h3><ul><li><b>KPI Cards</b> — ACI Index, DCE, CCE, PDCI, Quote Coverage, NRE Total</li><li><b>PLP Stage Pipeline</b> — Visual timeline of the program lifecycle</li><li><b>Cost Waterfall</b> — Bar chart showing ACI → DCE → CCE bridge</li><li><b>BOM Components Table</b> — Searchable, sortable table</li><li><b>Variance Drivers</b> — Toggle between ACI→DCE and DCE→CCE bridge drivers</li></ul>
<h3>L2 BOM Analysis</h3><ul><li>Summary KPI cards (total components, quoted count, coverage, ACI gap)</li><li>Full BOM table with search, category/status filters, and column sorting</li><li>Each component shows DCE, supplier quote, variance percentage, and AI insights</li></ul>
<h3>Variance Waterfall</h3><ul><li>Cost Waterfall chart (ACI → DCE → CCE)</li><li>Side-by-side variance driver tables for both bridge segments</li></ul>
<h3>Should Cost Calculator</h3><ul><li>3 commodities: Air Baffle, Top Cover, Riser Cage</li><li>All parameters are adjustable with real-time cost recalculation</li><li><b>Compare A/B</b> — Snap parameters to a B snapshot for side-by-side comparison</li><li><b>Sensitivity Analysis</b> — Tornado chart of cost drivers</li></ul>
<h3>Admin Panel</h3><ul><li><b>Download Blank Template</b> — Empty Excel with correct headers</li><li><b>Download Current Data</b> — JSON backup of all stored records</li><li><b>Upload Excel</b> — Drag-and-drop .xlsx with 4 required sheets</li><li><b>Activity Log</b> — Audit trail of uploads, edits, exports, resets</li><li><b>Web Editing Toggle</b> — Gate for inline cell editing</li></ul>
<h2>Excel Template Format</h2><p>The upload template requires 4 sheets: <b>Dashboard</b>, <b>Pipeline</b>, <b>BOM</b>, <b>ShouldCost_Params</b>. Download the blank template from Admin for exact column headers and formats.</p>
<h2>Web Editing</h2><p>When enabled in Admin, double-click any numeric cell in the BOM table (DCE, Quote, Ch1, Ch2) to edit inline. All edits are logged with old/new values in the Activity Log.</p>
<h2>Architecture</h2><table><tr><th>Layer</th><th>Technology</th></tr><tr><td>Frontend</td><td>React 19 + TypeScript + Vite</td></tr><tr><td>Styling</td><td>Tailwind CSS v4</td></tr><tr><td>Charts</td><td>Recharts</td></tr><tr><td>Excel</td><td>SheetJS (xlsx)</td></tr><tr><td>Storage</td><td>IndexedDB via Dexie.js (browser-local)</td></tr><tr><td>Deployment</td><td>Docker + nginx static serving</td></tr></table>
<h2>Docker Deployment</h2><p><code>docker compose up -d</code> — app available at <code>http://localhost:8080</code>.</p>
<h2>Data Privacy</h2><p>All data stays in your browser's IndexedDB. No data is sent to any server. Use the Export function in Admin to back up data.</p>
<p style="margin-top:32px;color:#94a3b8;font-size:12px">Lenovo Finance DT · Cost Guardian v2 · Build 2026-05-22</p>
</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (w) {
      w.onload = () => { w.print(); URL.revokeObjectURL(url); };
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset to demo data? This will replace all current data with SR650 V4 + SR630 V3 demo records.")) return;
    await resetToDemo();
  };

  const timeFmt = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "ok") return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    if (status === "warn") return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Dataset management &middot; Upload Excel, manage templates, activity log
        </p>
      </div>

      {/* Download section */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="section-label">Download</div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Download Full Template (4 Sheets) .xlsx
          </button>
          <button
            onClick={handleDownloadCurrentData}
            className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <Download className="w-4 h-4" />
            Download Current Data .xlsx
          </button>
          <button
            onClick={handleDownloadUserGuide}
            className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <Download className="w-4 h-4" />
            Download User Guide .pdf
          </button>
        </div>
      </div>

      {/* Upload section */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="section-label">Upload Data</div>
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {uploading ? (
            <p className="text-sm text-muted-foreground">Parsing file...</p>
          ) : (
            <>
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag & drop a .xlsx file here, or click to select
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Supports .xlsx / .xls
              </p>
            </>
          )}
        </div>
      </div>

      {/* Validation preview modal */}
      {showConfirm && validation && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40" onClick={() => setShowConfirm(false)}>
          <div className="bg-card rounded-xl border border-border shadow-xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground mb-1">Data Preview & Validation</h3>
            <p className="text-xs text-muted-foreground mb-4">{pendingFileName}</p>
            <div className="space-y-2 mb-4">
              {validation.sheets.map((s) => (
                <div key={s.name} className="flex items-center justify-between py-2 border-b border-border text-xs">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={s.status} />
                    <span className="font-medium">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span>{s.rows} rows</span>
                    <span>{s.status === "ok" ? "OK" : s.status === "warn" ? "Warning" : "Error"}</span>
                  </div>
                </div>
              ))}
            </div>
            {validation.issues.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-[11px] font-semibold text-amber-800 mb-1">Issues found:</p>
                {validation.issues.slice(0, 5).map((iss, i) => (
                  <p key={i} className="text-[10px] text-amber-700">{iss.sheet} row {iss.row}: {iss.issue}</p>
                ))}
                {validation.issues.length > 5 && (
                  <p className="text-[10px] text-amber-700">...and {validation.issues.length - 5} more</p>
                )}
              </div>
            )}
            <p className="text-xs text-destructive font-medium mb-4">
              This will overwrite all current data ({dashboard.length} Dashboard, {pipeline.length} Pipeline, {bom.length} BOM, {shouldcostParams.length} ShouldCost_Params records).
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmUpload}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90"
              >
                Confirm & Load Data
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2.5 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="section-label">Activity Log</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 pr-3 font-semibold">Time</th>
                <th className="text-left py-2 px-3 font-semibold">User</th>
                <th className="text-left py-2 px-3 font-semibold">Action</th>
                <th className="text-left py-2 px-3 font-semibold">Detail</th>
                <th className="text-left py-2 pl-3 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              {activityLog.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    No activity yet
                  </td>
                </tr>
              ) : (
                activityLog.slice(0, 30).map((entry, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-2 pr-3 text-muted-foreground font-mono">{timeFmt(entry.timestamp)}</td>
                    <td className="py-2 px-3 font-medium">{entry.user}</td>
                    <td className="py-2 px-3">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        entry.action === "Upload" ? "bg-blue-100 text-blue-700" :
                        entry.action === "Edit" ? "bg-amber-100 text-amber-700" :
                        entry.action === "Export" ? "bg-emerald-100 text-emerald-700" :
                        "bg-violet-100 text-violet-700"
                      }`}>
                        {entry.action}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-muted-foreground max-w-[300px] truncate">{entry.detail}</td>
                    <td className="py-2 pl-3 text-muted-foreground">{entry.source}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload History */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="section-label">Upload History</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 pr-3 font-semibold">Date</th>
                <th className="text-left py-2 px-3 font-semibold">File</th>
                <th className="text-left py-2 px-3 font-semibold">By</th>
                <th className="text-right py-2 px-3 font-semibold">Rows</th>
                <th className="text-left py-2 pl-3 font-semibold">Sheets</th>
              </tr>
            </thead>
            <tbody>
              {uploadMeta.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    No uploads yet
                  </td>
                </tr>
              ) : (
                uploadMeta.slice(0, 10).map((meta, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-2 pr-3 text-muted-foreground font-mono">{timeFmt(meta.uploadedAt)}</td>
                    <td className="py-2 px-3 font-medium">{meta.fileName}</td>
                    <td className="py-2 px-3 text-muted-foreground">{meta.uploadedBy}</td>
                    <td className="py-2 px-3 text-right font-medium">{meta.totalRows}</td>
                    <td className="py-2 pl-3 text-muted-foreground">{meta.sheets.map((s) => `${s.name}(${s.rows})`).join(", ")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="section-label">Settings</div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Web Editing</p>
              <p className="text-[10px] text-muted-foreground">When enabled, BOM cells and SCC parameters can be edited directly on the page</p>
            </div>
            <button
              onClick={() => setWebEditingEnabled(!webEditingEnabled)}
              className="flex items-center gap-2 transition-colors"
            >
              {webEditingEnabled ? (
                <ToggleRight className="w-8 h-8 text-primary" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-muted-foreground" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Platform</p>
              <p className="text-[10px] text-muted-foreground">Select active platform for data filtering</p>
            </div>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="border border-border rounded-lg px-3 py-1.5 text-sm bg-secondary text-foreground font-medium"
            >
              <option>SR650 V4</option>
              <option>SR630 V3</option>
            </select>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 border border-destructive/30 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/5 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Demo Data
            </button>
            <p className="text-[10px] text-muted-foreground mt-1">Restore SR650 V4 + SR630 V3 demo records</p>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs font-semibold text-foreground">Cost Guardian v2.0</p>
            <p className="text-[10px] text-muted-foreground">Lenovo Finance DT &middot; Build: 2026-05-22</p>
          </div>
        </div>
      </div>
    </div>
  );
}
