import {
  LayoutDashboard,
  Table2,
  BarChart3,
  Calculator,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const BUSINESS_ITEMS = [
  { id: "program", label: "Program Dashboard", icon: LayoutDashboard },
  { id: "bom", label: "L2 BOM Analysis", icon: Table2 },
  { id: "waterfall", label: "Variance Waterfall", icon: BarChart3 },
  { id: "shouldcost", label: "Should Cost Calculator", icon: Calculator },
];

export default function Sidebar({ activeTab, onTabChange, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-14 bottom-0 z-40 bg-card border-r border-border transition-all duration-200 flex flex-col ${
        collapsed ? "w-16" : "w-[240px]"
      }`}
    >
      <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
        {BUSINESS_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition duration-150 ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium border-l-[3px] border-blue-600 rounded-l-none shadow-[inset_0_1px_3px_rgba(37,99,235,0.08)]"
                  : "text-slate-500 hover:text-foreground hover:bg-slate-100 hover:scale-[1.01] border-l-[3px] border-transparent rounded-l-none"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
              {!collapsed && <span className="text-xs font-medium truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Separator + Admin */}
      <div className="border-t border-border px-2 py-2">
        <button
          onClick={() => onTabChange("admin")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition duration-150 ${
            activeTab === "admin"
              ? "bg-blue-50 text-blue-600 font-medium border-l-[3px] border-blue-600 rounded-l-none shadow-[inset_0_1px_3px_rgba(37,99,235,0.08)]"
              : "text-slate-500 hover:text-foreground hover:bg-slate-100 hover:scale-[1.01] border-l-[3px] border-transparent rounded-l-none"
          }`}
        >
          <Shield className={`w-4 h-4 shrink-0 ${activeTab === "admin" ? "text-primary" : ""}`} />
          {!collapsed && <span className="text-xs font-medium">Admin</span>}
        </button>
      </div>

      <div className="px-3 py-3 border-t border-border">
        {!collapsed && (
          <div className="text-[10px] text-muted-foreground text-center mb-2">
            Lenovo Finance DT
          </div>
        )}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
