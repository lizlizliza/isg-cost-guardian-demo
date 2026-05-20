interface ParameterSelectProps {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}

export default function ParameterSelect({ label, value, options, onChange }: ParameterSelectProps) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-[140px] text-xs text-muted-foreground shrink-0">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 text-xs border border-border rounded-md px-3 py-1.5 bg-card
          focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer font-medium"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
