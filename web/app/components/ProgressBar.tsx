interface ProgressBarProps { value: number; max: number; colorClass?: string; }
export default function ProgressBar({ value, max, colorClass = "bg-primary" }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full bg-muted rounded-full h-2">
      <div className={`h-2 rounded-full transition-all ${colorClass}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
