import {
  LayoutDashboard,
  Table2,
  BarChart3,
  Calculator,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { id: "program", label: "Program Dashboard", icon: LayoutDashboard },
  { id: "bom", label: "L2 BOM Analysis", icon: Table2 },
  { id: "waterfall", label: "Variance Waterfall", icon: BarChart3 },
  { id: "shouldcost", label: "Should Cost Calculator", icon: Calculator },
];

export default function Sidebar({ activeTab, onTabChange, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-14 bottom-0 z-40 bg-card border-r border-border transition-all duration-200 flex flex-col ${
        collapsed ? "w-16" : "w-[260px]"
      }`}
    >
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all ${
                isActive
                  ? "bg-sidebar-accent text-primary border-l-[3px] border-primary rounded-l-none"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-[3px] border-transparent rounded-l-none"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="text-xs font-medium truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
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
