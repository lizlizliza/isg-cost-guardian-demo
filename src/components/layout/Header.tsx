import { ChevronDown, LogOut } from "lucide-react";
import { useRef, useState } from "react";
import type { Program } from "../../types";
import type { AppUser } from "../../App";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedProgram: Program | undefined;
  programs: Program[];
  onProgramChange: (id: string) => void;
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
  activeTab, onTabChange, selectedProgram, programs, onProgramChange,
  currentUser, onUserChange, users,
}: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [programMenuOpen, setProgramMenuOpen] = useState(false);
  const programRef = useRef<HTMLDivElement>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-14 flex items-center px-6 gap-6">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xl font-bold" style={{ color: "#2563EB" }}>Lenovo</span>
        <span className="text-muted-foreground/40 text-lg">|</span>
        <span className="text-sm font-medium text-foreground hidden sm:inline">
          Cost Governance Platform
        </span>
      </div>

      <nav className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors rounded-md ${
              activeTab === tab.id
                ? "text-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span className="ml-1.5 text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                {tab.badge}
              </span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3 shrink-0">
        {/* Program selector - custom dropdown */}
        <div className="relative" ref={programRef}>
          <button
            onClick={() => setProgramMenuOpen(!programMenuOpen)}
            className="flex items-center gap-2 text-xs border border-border rounded-lg px-3 py-1.5 bg-secondary text-foreground font-medium hover:bg-muted transition-colors whitespace-nowrap"
          >
            {selectedProgram?.name ?? "Select Program"}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${programMenuOpen ? "rotate-180" : ""}`} />
          </button>
          {programMenuOpen && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => setProgramMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-[60] w-52 bg-card border border-border rounded-xl shadow-lg py-1">
                {programs.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { onProgramChange(p.id); setProgramMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                      p.id === selectedProgram?.id
                        ? "bg-primary/5 text-primary font-medium"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <div className="font-medium">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground">{p.subtitle}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* User avatar with dropdown */}
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
                <div className="py-1">
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
                </div>
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
