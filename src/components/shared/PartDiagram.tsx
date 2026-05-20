import type { Commodity } from "../../types";

interface PartDiagramProps {
  commodity: Commodity;
  surfaceArea: number;
  params: {
    length: number;
    width: number;
    thickness: number;
    extraDim1: number;
    extraDim2?: number;
    slotCount?: number;
  };
}

function AirBaffleDiagram({ surfaceArea, length, width, thickness, extraDim1 }: PartDiagramProps["params"] & { surfaceArea: number }) {
  const l = (length / 10).toFixed(1);
  const w = (width / 10).toFixed(1);
  return (
    <svg viewBox="0 0 600 220" className="w-full h-full">
      <rect x="0" y="0" width="600" height="220" fill="#0F172A" rx="8" />
      <rect x="60" y="40" width="280" height="70" rx="3" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={80 + i * 65} y="30" width="8" height="90" rx="1" fill="#334155" stroke="#60A5FA" strokeWidth="0.8" />
      ))}
      <rect x="380" y="60" width="180" height="8" rx="1" fill="#1E293B" stroke="#3B82F6" strokeWidth="1" />
      <rect x="380" y="85" width="180" height="8" rx="1" fill="#1E293B" stroke="#3B82F6" strokeWidth="1" />
      <line x1="380" y1="68" x2="380" y2="85" stroke="#60A5FA" strokeWidth="0.5" />
      <line x1="560" y1="68" x2="560" y2="85" stroke="#60A5FA" strokeWidth="0.5" />
      <line x1="60" y1="20" x2="340" y2="20" stroke="#94A3B8" strokeWidth="0.5" />
      <line x1="60" y1="15" x2="60" y2="25" stroke="#94A3B8" strokeWidth="0.5" />
      <line x1="340" y1="15" x2="340" y2="25" stroke="#94A3B8" strokeWidth="0.5" />
      <text x="200" y="15" textAnchor="middle" fill="#94A3B8" fontSize="9">{l} cm</text>
      <line x1="350" y1="40" x2="350" y2="110" stroke="#94A3B8" strokeWidth="0.5" />
      <line x1="345" y1="40" x2="355" y2="40" stroke="#94A3B8" strokeWidth="0.5" />
      <line x1="345" y1="110" x2="355" y2="110" stroke="#94A3B8" strokeWidth="0.5" />
      <text x="360" y="78" fill="#94A3B8" fontSize="9">{w} cm</text>
      <text x="200" y="130" textAnchor="middle" fill="#3B82F6" fontSize="10" fontWeight="600">TOP VIEW</text>
      <text x="470" y="110" textAnchor="middle" fill="#3B82F6" fontSize="10" fontWeight="600">SIDE VIEW</text>
      <text x="20" y="155" fill="#64748B" fontSize="9">Surface Area: ~{surfaceArea.toFixed(1)} cm²</text>
      <text x="20" y="170" fill="#64748B" fontSize="9">Thickness: {thickness} mm</text>
      <text x="20" y="185" fill="#64748B" fontSize="9">Vanes: {extraDim1}</text>
      <line x1="380" y1="40" x2="380" y2="110" stroke="#F59E0B" strokeWidth="0.8" strokeDasharray="4 2" />
      <text x="380" y="195" textAnchor="middle" fill="#F59E0B" fontSize="8">Section A-A</text>
    </svg>
  );
}

function TopCoverDiagram({ surfaceArea, length, width, extraDim1 }: PartDiagramProps["params"] & { surfaceArea: number }) {
  const l = (length / 10).toFixed(1);
  const w = (width / 10).toFixed(1);
  return (
    <svg viewBox="0 0 600 220" className="w-full h-full">
      <rect x="0" y="0" width="600" height="220" fill="#0F172A" rx="8" />
      <rect x="40" y="50" width="360" height="110" rx="3" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={60 + i * 34} y="70" width="18" height="12" rx="1" fill="#0F172A" stroke="#475569" strokeWidth="0.5" />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={60 + i * 34} y="90" width="18" height="12" rx="1" fill="#0F172A" stroke="#475569" strokeWidth="0.5" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={55 + i * 115} cy="142" r="4" fill="none" stroke="#60A5FA" strokeWidth="1" />
      ))}
      <rect x="240" y="65" width="90" height="60" rx="2" fill="#0F172A" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="40" y1="35" x2="400" y2="35" stroke="#94A3B8" strokeWidth="0.5" />
      <line x1="40" y1="30" x2="40" y2="40" stroke="#94A3B8" strokeWidth="0.5" />
      <line x1="400" y1="30" x2="400" y2="40" stroke="#94A3B8" strokeWidth="0.5" />
      <text x="220" y="30" textAnchor="middle" fill="#94A3B8" fontSize="9">{l} cm</text>
      <line x1="420" y1="50" x2="420" y2="160" stroke="#94A3B8" strokeWidth="0.5" />
      <line x1="415" y1="50" x2="425" y2="50" stroke="#94A3B8" strokeWidth="0.5" />
      <line x1="415" y1="160" x2="425" y2="160" stroke="#94A3B8" strokeWidth="0.5" />
      <text x="435" y="108" fill="#94A3B8" fontSize="9">{w} cm</text>
      <text x="220" y="180" textAnchor="middle" fill="#3B82F6" fontSize="10" fontWeight="600">TOP VIEW</text>
      <text x="20" y="200" fill="#64748B" fontSize="9">SA: ~{surfaceArea.toFixed(1)} cm² &middot; Cutout: {extraDim1}%</text>
      <text x="285" y="80" fill="#F59E0B" fontSize="7">Cutout</text>
    </svg>
  );
}

function RiserCageDiagram({ surfaceArea, length, width, extraDim1, extraDim2, slotCount }: PartDiagramProps["params"] & { surfaceArea: number }) {
  const l = (length / 10).toFixed(1);
  const w = (width / 10).toFixed(1);
  return (
    <svg viewBox="0 0 600 220" className="w-full h-full">
      <rect x="0" y="0" width="600" height="220" fill="#0F172A" rx="8" />
      <polygon points="120,100 300,60 420,90 240,130" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5" />
      <polygon points="120,100 120,150 240,180 240,130" fill="#334155" stroke="#3B82F6" strokeWidth="1" />
      <polygon points="240,130 240,180 420,140 420,90" fill="#1E293B" stroke="#3B82F6" strokeWidth="1" />
      <rect x="150" y="105" width="8" height="45" rx="1" fill="#2563EB" opacity="0.6" />
      <rect x="175" y="100" width="8" height="45" rx="1" fill="#2563EB" opacity="0.6" />
      <rect x="200" y="95" width="8" height="45" rx="1" fill="#2563EB" opacity="0.6" />
      <rect x="265" y="95" width="8" height="40" rx="1" fill="#7C3AED" opacity="0.6" />
      <rect x="290" y="97" width="8" height="38" rx="1" fill="#7C3AED" opacity="0.6" />
      <circle cx="130" cy="140" r="3" fill="none" stroke="#60A5FA" strokeWidth="0.8" />
      <circle cx="280" cy="155" r="3" fill="none" stroke="#60A5FA" strokeWidth="0.8" />
      <circle cx="390" cy="125" r="3" fill="none" stroke="#60A5FA" strokeWidth="0.8" />
      <line x1="120" y1="45" x2="300" y2="25" stroke="#94A3B8" strokeWidth="0.5" />
      <text x="210" y="20" fill="#94A3B8" fontSize="9" textAnchor="middle">{l} cm</text>
      <line x1="440" y1="90" x2="440" y2="140" stroke="#94A3B8" strokeWidth="0.5" />
      <text x="455" y="118" fill="#94A3B8" fontSize="9">{w} cm</text>
      <text x="270" y="200" textAnchor="middle" fill="#3B82F6" fontSize="10" fontWeight="600">ISOMETRIC VIEW</text>
      <text x="20" y="40" fill="#64748B" fontSize="9">SA: ~{surfaceArea.toFixed(1)} cm² &middot; Slots: {slotCount ?? 2}</text>
      <text x="20" y="55" fill="#64748B" fontSize="9">Depth: {extraDim1} mm &middot; Holes: {extraDim2 ?? 0}</text>
      <text x="160" y="162" fill="#2563EB" fontSize="7">PCIe</text>
      <text x="275" y="148" fill="#7C3AED" fontSize="7">OCP</text>
    </svg>
  );
}

const DIAGRAMS: Record<string, typeof AirBaffleDiagram> = {
  "air-baffle": AirBaffleDiagram,
  "top-cover": TopCoverDiagram,
  "riser-cage": RiserCageDiagram,
};

export default function PartDiagram({ commodity, surfaceArea, params }: PartDiagramProps) {
  const Diagram = DIAGRAMS[commodity.id] || AirBaffleDiagram;

  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
      <div className="h-[200px]">
        <Diagram surfaceArea={surfaceArea} {...params} />
      </div>
      <div className="bg-card px-4 py-2 flex flex-wrap gap-x-5 gap-y-0.5 text-[10px] text-muted-foreground border-t border-border">
        <span>Part No: <span className="font-medium text-foreground">{commodity.partNo}</span></span>
        <span>Assembly: <span className="font-medium text-foreground">{commodity.assembly}</span></span>
        <span>Last Gen: <span className="font-medium text-foreground">{commodity.lastGenRef}</span></span>
        <span>Qual: <span className="font-medium text-foreground">{commodity.qualification}</span></span>
      </div>
    </div>
  );
}
