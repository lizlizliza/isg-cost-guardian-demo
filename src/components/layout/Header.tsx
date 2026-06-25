import { ChevronDown, Download, LogOut } from "lucide-react";
import { useState } from "react";
import type { AppUser } from "../../App";
import { useData } from "../../context/DataContext";
import { generateExcelExport, downloadExcel } from "../../utils/excel";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: AppUser;
  onUserChange: (user: AppUser) => void;
  users: AppUser[];
}

const TABS = [
  { id: "program", label: "Program Dashboard" },
  { id: "bom", label: "L2 BOM Analysis" },
  { id: "waterfall", label: "Variance Waterfall" },
  { id: "shouldcost", label: "Should Cost Calculator", badge: "DEMO" },
];

export default function Header({
  activeTab, onTabChange, currentUser, onUserChange, users,
}: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [programMenuOpen, setProgramMenuOpen] = useState(false);
  const { platform, setPlatform, dashboard, pipeline, bom, shouldcostParams, addActivity } = useData();

  const handleExport = async () => {
    const data = { dashboard, pipeline, bom, shouldcostParams };
    const xlsx = generateExcelExport(data);
    const label = TABS.find((t) => t.id === activeTab)?.label ?? activeTab;
    downloadExcel(xlsx, `cost-guardian-${activeTab}-${new Date().toISOString().slice(0, 10)}.xlsx`);
    await addActivity(currentUser.name, "Export", `${label} full export`, label);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b-2 border-border h-14 flex items-center px-6 gap-4 shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xl font-bold" style={{ color: "#2563EB" }}>Lenovo</span>
        <span className="text-muted-foreground/40 text-lg">|</span>
        <span className="text-sm font-medium text-foreground hidden sm:inline">
          Cost Governance Platform
        </span>
      </div>

      <nav className="flex items-center gap-0.5 flex-1 min-w-0">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-3.5 py-2 text-xs whitespace-nowrap rounded-md transition-all duration-200 border-b-2 ${
                isActive
                  ? "text-blue-600 font-semibold bg-blue-50/60 border-b-blue-600"
                  : "text-slate-500 font-medium border-b-transparent hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span className={`ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-700"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 shrink-0">
        {/* Export */}
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 text-xs font-medium border border-border rounded-lg px-3 py-1.5 bg-card text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-muted-foreground/30 transition-all"
          title="Export current tab data to Excel"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Platform selector */}
        <div className="relative">
          <button
            onClick={() => setProgramMenuOpen(!programMenuOpen)}
            className="flex items-center gap-2 text-xs border border-border rounded-lg px-3 py-1.5 bg-secondary text-foreground font-medium hover:bg-muted transition-colors whitespace-nowrap"
          >
            {platform}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${programMenuOpen ? "rotate-180" : ""}`} />
          </button>
          {programMenuOpen && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => setProgramMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-[60] w-44 bg-card border border-border rounded-xl shadow-lg py-1">
                {["SR650 V4", "SR630 V3"].map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPlatform(p); setProgramMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                      p === platform ? "bg-primary/5 text-primary font-medium" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* User avatar */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">
              {currentUser.initials}
            </div>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-[60] w-48 bg-card border border-border rounded-xl shadow-lg py-1">
                <div className="px-4 py-2 border-b border-border">
                  <div className="text-xs font-medium text-foreground">{currentUser.name}</div>
                  {currentUser.email && (
                    <div className="text-[10px] text-muted-foreground">{currentUser.email}</div>
                  )}
                </div>
                {users.map((u) => (
                  <button
                    key={u.initials}
                    onClick={() => { onUserChange(u); setUserMenuOpen(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-1.5 text-xs transition-colors ${
                      u.initials === currentUser.initials
                        ? "bg-primary/5 text-primary font-medium"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[8px] font-semibold">
                      {u.initials}
                    </div>
                    {u.name}
                  </button>
                ))}
                <div className="border-t border-border pt-1">
                  <button className="w-full flex items-center gap-2 px-4 py-1.5 text-xs text-muted-foreground hover:bg-secondary transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
