export function formatSTX(microSTX: number): string {
  return `${(microSTX / 1_000_000).toFixed(2)} STX`;
}
export function formatBPS(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

export function formatBlocksToTime(blocks: number): string {
  const minutes = blocks * 10;
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}
