import type { Commodity } from "../../types";

interface CommodityCardProps {
  commodity: Commodity;
  selected: boolean;
  onSelect: () => void;
}

function AirBaffleIcon() {
  return (
    <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
      <rect x="4" y="10" width="32" height="8" rx="1" stroke="#D97706" strokeWidth="1.5" />
      <rect x="4" y="22" width="32" height="8" rx="1" stroke="#D97706" strokeWidth="1.5" />
      <line x1="10" y1="10" x2="10" y2="30" stroke="#2563EB" strokeWidth="1" />
      <line x1="20" y1="10" x2="20" y2="30" stroke="#2563EB" strokeWidth="1" />
      <line x1="30" y1="10" x2="30" y2="30" stroke="#2563EB" strokeWidth="1" />
    </svg>
  );
}

function TopCoverIcon() {
  return (
    <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
      <rect x="4" y="8" width="32" height="24" rx="2" stroke="#D97706" strokeWidth="1.5" />
      <rect x="10" y="14" width="8" height="6" rx="1" stroke="#2563EB" strokeWidth="1" />
      <rect x="22" y="14" width="8" height="6" rx="1" stroke="#2563EB" strokeWidth="1" />
      <circle cx="12" cy="27" r="1.5" fill="#6B7280" />
      <circle cx="20" cy="27" r="1.5" fill="#6B7280" />
      <circle cx="28" cy="27" r="1.5" fill="#6B7280" />
    </svg>
  );
}

function RiserCageIcon() {
  return (
    <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
      <rect x="6" y="6" width="28" height="28" rx="2" stroke="#D97706" strokeWidth="1.5" />
      <rect x="10" y="10" width="6" height="20" rx="0.5" fill="#2563EB" opacity="0.3" stroke="#2563EB" strokeWidth="0.8" />
      <rect x="18" y="10" width="6" height="20" rx="0.5" fill="#2563EB" opacity="0.3" stroke="#2563EB" strokeWidth="0.8" />
      <rect x="26" y="10" width="4" height="20" rx="0.5" fill="#7C3AED" opacity="0.3" stroke="#7C3AED" strokeWidth="0.8" />
    </svg>
  );
}

const ICONS: Record<string, () => JSX.Element> = {
  "air-baffle": AirBaffleIcon,
  "top-cover": TopCoverIcon,
  "riser-cage": RiserCageIcon,
};

const TAG_COLORS: Record<string, string> = {
  gray: "bg-gray-100 text-gray-600",
  blue: "bg-blue-100 text-blue-600",
};

export default function CommodityCard({ commodity, selected, onSelect }: CommodityCardProps) {
  const Icon = ICONS[commodity.id] || AirBaffleIcon;

  return (
    <button
      onClick={onSelect}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-left transition-all ${
        selected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border bg-card hover:border-muted-foreground/30 hover:shadow-sm"
      }`}
    >
      <Icon />
      <div className="font-bold text-[15px] text-foreground">{commodity.name}</div>
      <div className="text-xs text-muted-foreground -mt-1">{commodity.subtitle}</div>
      <span
        className={`text-[10px] font-medium px-2 py-0.5 rounded ${
          TAG_COLORS[commodity.tagColor] || TAG_COLORS.gray
        }`}
      >
        {commodity.tag}
      </span>
      <div className="text-xs text-primary/80 font-medium mt-1">
        DCE: {commodity.typicalDCE}
      </div>
    </button>
  );
}
