interface ParameterSelectProps {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function ParameterSelect({ label, value, options, onChange, disabled }: ParameterSelectProps) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-[140px] text-xs text-muted-foreground shrink-0">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 text-xs border border-border rounded-md px-3 py-1.5 bg-card
          focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer font-medium disabled:opacity-50"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
