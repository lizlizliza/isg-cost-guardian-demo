interface ReadonlyFieldProps {
  label: string;
  value: string;
  unit?: string;
}

export default function ReadonlyField({ label, value, unit }: ReadonlyFieldProps) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-[140px] text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-xs font-semibold text-foreground">{value}</span>
      {unit && <span className="text-[10px] text-muted-foreground">{unit}</span>}
    </div>
  );
}
