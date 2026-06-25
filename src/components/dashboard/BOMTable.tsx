import { useMemo, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { useData } from "../../context/DataContext";
import type { BOMRecord } from "../../types";

// Design pattern: Table Hover Comment — see design-knowledge/table-hover-comment-pattern.md

type SortKey = "component" | "category" | "dce" | "quote" | "ch1" | "ch2" | "status";
type SortDir = "asc" | "desc";

const STATUS_COLORS: Record<string, string> = {
  OK: "bg-emerald-100 text-emerald-700",
  "At Risk": "bg-amber-100 text-amber-700",
  Blocked: "bg-red-100 text-red-700",
};

const CATEGORIES = ["ECAD", "Mechanical", "Management", "Thermal", "Power"];
const STATUSES = ["OK", "At Risk", "Blocked"];

export default function BOMTable() {
  const { bom, platform, webEditingEnabled, updateBOMField } = useData();
  const currentUser = "Kevin Fang"; // will be wired to AppUser context later

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<SortKey>("dce");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [editingCell, setEditingCell] = useState<{ id: number; field: string } | null>(null);
  const [editValue, setEditValue] = useState("");

  const platformBom = useMemo(
    () => bom.filter((b) => b.platform === platform),
    [bom, platform]
  );

  const filtered = useMemo(() => {
    let list = [...platformBom];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((b) => b.component.toLowerCase().includes(q));
    }
    if (categoryFilter !== "All") {
      list = list.filter((b) => b.category === categoryFilter);
    }
    if (statusFilter !== "All") {
      list = list.filter((b) => b.status === statusFilter);
    }

    list.sort((a, b) => {
      let aVal: string | number, bVal: string | number;
      if (sortKey === "component") { aVal = a.component; bVal = b.component; }
      else if (sortKey === "category") { aVal = a.category; bVal = b.category; }
      else if (sortKey === "dce") { aVal = a.dce; bVal = b.dce; }
      else if (sortKey === "quote") { aVal = a.quote ?? 0; bVal = b.quote ?? 0; }
      else if (sortKey === "ch1") { aVal = a.ch1; bVal = b.ch1; }
      else if (sortKey === "ch2") { aVal = a.ch2; bVal = b.ch2; }
      else { aVal = a.status; bVal = b.status; }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return list;
  }, [platformBom, search, categoryFilter, statusFilter, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const startEdit = useCallback((id: number, field: string, currentValue: number) => {
    if (!webEditingEnabled) return;
    setEditingCell({ id, field });
    setEditValue(String(currentValue));
  }, [webEditingEnabled]);

  const commitEdit = useCallback(async () => {
    if (!editingCell) return;
    const newVal = parseFloat(editValue);
    if (isNaN(newVal)) {
      setEditingCell(null);
      return;
    }
    const record = bom.find((b) => (b as BOMRecord & { id?: number }).id === editingCell.id);
    if (!record) { setEditingCell(null); return; }
    const fieldVal = editingCell.field === "dce" ? record.dce :
      editingCell.field === "quote" ? (record.quote ?? 0) :
      editingCell.field === "ch1" ? record.ch1 :
      record.ch2;
    if (fieldVal === newVal) { setEditingCell(null); return; }

    await updateBOMField(editingCell.id, editingCell.field, fieldVal, newVal, currentUser);
    setEditingCell(null);
  }, [editingCell, editValue, bom, updateBOMField]);

  const SortArrow = ({ field }: { field: SortKey }) => {
    if (sortKey !== field) return <span className="text-[9px] text-muted-foreground/40 ml-0.5">↕</span>;
    return <span className="text-[9px] text-primary ml-0.5">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const EditableCell = ({ id, field, value }: { id: number; field: string; value: number }) => {
    const isEditing = editingCell?.id === id && editingCell?.field === field;
    if (isEditing) {
      return (
        <input
          autoFocus
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditingCell(null); }}
          className="w-20 text-right text-xs border border-primary rounded px-1 py-0.5 bg-background"
        />
      );
    }
    return (
      <span
        className={webEditingEnabled ? "cursor-pointer hover:bg-primary/10 rounded px-1 -mx-1" : ""}
        onDoubleClick={() => startEdit(id, field, value)}
        title={webEditingEnabled ? "Double-click to edit" : "Editing disabled"}
      >
        ${value}
      </span>
    );
  };

  const quotedCount = platformBom.filter((b) => b.quote != null).length;

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="section-label mb-0">BOM Components</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">{quotedCount}/{platformBom.length} quoted</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative flex-1 min-w-[140px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs border border-border rounded-lg px-2.5 py-1.5 bg-background"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs border border-border rounded-lg px-2.5 py-1.5 bg-background"
        >
          <option value="All">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-2 font-semibold cursor-pointer select-none" onClick={() => handleSort("component")}>
                Component<SortArrow field="component" />
              </th>
              <th className="text-left py-2 px-2 font-semibold cursor-pointer select-none" onClick={() => handleSort("category")}>
                Category<SortArrow field="category" />
              </th>
              <th className="text-right py-2 px-2 font-semibold cursor-pointer select-none" onClick={() => handleSort("dce")}>
                DCE<SortArrow field="dce" />
              </th>
              <th className="text-right py-2 px-2 font-semibold cursor-pointer select-none" onClick={() => handleSort("quote")}>
                Quote<SortArrow field="quote" />
              </th>
              <th className="text-right py-2 px-2 font-semibold cursor-pointer select-none">Var.</th>
              <th className="text-right py-2 px-2 font-semibold cursor-pointer select-none" onClick={() => handleSort("ch1")}>
                Ch. 1<SortArrow field="ch1" />
              </th>
              <th className="text-right py-2 px-2 font-semibold cursor-pointer select-none" onClick={() => handleSort("ch2")}>
                Ch. 2<SortArrow field="ch2" />
              </th>
              <th className="text-center py-2 px-2 font-semibold">Mat.</th>
              <th className="text-center py-2 px-2 font-semibold cursor-pointer select-none" onClick={() => handleSort("status")}>
                Status<SortArrow field="status" />
              </th>
              <th className="text-left py-2 pl-2 font-semibold w-0">💡</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-6 text-center text-muted-foreground">
                  No components match the current filters
                </td>
              </tr>
            ) : (
              filtered.map((comp, i) => {
                const id = (comp as BOMRecord & { id?: number }).id ?? i;
                const variance = comp.quote != null ? comp.quote - comp.dce : 0;
                const variancePct = comp.quote != null && comp.dce > 0 ? ((comp.quote - comp.dce) / comp.dce) * 100 : 0;
                const costMaturity = comp.status === "OK" ? 5 : comp.status === "At Risk" ? 3 : 2;
                const isBlocked = comp.status === "Blocked";
                const isAtRisk = comp.status === "At Risk";
                const hasInsight = comp.aiInsight && comp.aiInsight.trim().length > 0;
                return (
                  <tr
                    key={id}
                    className={`
                      group
                      border-b border-border/50 last:border-0
                      transition-all duration-200
                      border-l-[3px] border-l-transparent
                      ${isBlocked
                        ? 'hover:border-l-destructive hover:bg-red-50/40'
                        : isAtRisk
                          ? 'hover:border-l-amber-500 hover:bg-amber-50/40'
                          : 'hover:border-l-primary hover:bg-secondary/40'
                      }
                    `}
                  >
                    <td className="py-2 pr-2 font-medium text-foreground">{comp.component}</td>
                    <td className="py-2 px-2 text-muted-foreground">{comp.category}</td>
                    <td className="py-2 px-2 text-right font-medium">
                      <EditableCell id={id} field="dce" value={comp.dce} />
                    </td>
                    <td className="py-2 px-2 text-right font-medium">
                      {comp.quote != null ? (
                        <EditableCell id={id} field="quote" value={comp.quote} />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className={`py-2 px-2 text-right font-medium ${variance > 0 ? "text-destructive" : "text-emerald-600"}`}>
                      {comp.quote != null ? `${variance > 0 ? "+" : ""}${variancePct.toFixed(1)}%` : "—"}
                    </td>
                    <td className="py-2 px-2 text-right text-muted-foreground">
                      <EditableCell id={id} field="ch1" value={comp.ch1} />
                    </td>
                    <td className="py-2 px-2 text-right text-muted-foreground">
                      <EditableCell id={id} field="ch2" value={comp.ch2} />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <div className="flex items-center justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`w-1.5 h-1.5 rounded-full mx-[1px] ${
                              star <= costMaturity ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${STATUS_COLORS[comp.status] || "bg-muted text-muted-foreground"}`}>
                        {comp.status}
                      </span>
                    </td>
                    <td className="py-2 pl-2 pr-0 group-hover:pr-3 transition-all duration-200">
                      {hasInsight && (
                        <span
                          className={`
                            inline-block overflow-hidden whitespace-nowrap
                            transition-all duration-300 ease-out
                            italic text-muted-foreground text-xs
                            max-w-0 opacity-0
                            group-hover:max-w-[300px] group-hover:opacity-100
                          `}
                        >
                          {comp.aiInsight}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
