export function formatSTX(microSTX: number): string {
  return `${(microSTX / 1_000_000).toFixed(2)} STX`;
}
export function formatBPS(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}
