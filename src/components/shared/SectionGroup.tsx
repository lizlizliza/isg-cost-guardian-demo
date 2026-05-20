import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

interface SectionGroupProps {
  title: string;
  accent: string;
  subtotal?: string;
  defaultOpen?: boolean;
  callout?: string;
  children: ReactNode;
}

export default function SectionGroup({
  title, accent, subtotal, defaultOpen = true, callout, children,
}: SectionGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3"
      >
        <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: accent }} />
        <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground flex-1 text-left">
          {title}
        </span>
        {subtotal && (
          <span className="text-xs font-semibold text-foreground">${subtotal}</span>
        )}
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="pt-3 space-y-0.5">{children}</div>
          {callout && (
            <div className="mt-3 text-[10px] text-muted-foreground bg-secondary rounded-md px-3 py-2 border border-border">
              {callout}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
