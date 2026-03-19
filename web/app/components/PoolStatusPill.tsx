type Status = "active" | "resolved" | "cancelled" | "pending";
export default function PoolStatusPill({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    active: "bg-green-500/20 text-green-400",
    resolved: "bg-blue-500/20 text-blue-400",
    cancelled: "bg-gray-500/20 text-gray-400",
    pending: "bg-yellow-500/20 text-yellow-400",
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}>{status.toUpperCase()}</span>;
}
