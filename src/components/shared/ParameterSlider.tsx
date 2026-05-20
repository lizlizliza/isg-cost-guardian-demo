interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}

export default function ParameterSlider({
  label, value, min, max, step, unit, onChange,
}: ParameterSliderProps) {
  const pct = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  return (
    <div className="flex items-center gap-3 py-1.5 group">
      <span className="w-[140px] text-xs text-muted-foreground shrink-0">{label}</span>
      <div className="flex-1 flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            background: `linear-gradient(to right, #2563EB 0%, #2563EB ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`,
          }}
          className="flex-1 h-2 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2563EB] [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
        />
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-[72px] text-xs text-right border border-border rounded-md px-2 py-1 bg-card
            focus:outline-none focus:ring-1 focus:ring-ring font-medium"
        />
      </div>
      <span className="text-[10px] text-muted-foreground w-8 text-right">{unit}</span>
    </div>
  );
}
