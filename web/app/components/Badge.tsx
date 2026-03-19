interface BadgeProps { label: string; variant?: "default" | "success" | "warning" | "danger"; }
export default function Badge({ label, variant = "default" }: BadgeProps) {
  const colors = {
    default: "bg-muted text-muted-foreground",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    danger: "bg-red-500/20 text-red-400",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[variant]}`}>{label}</span>;
}
