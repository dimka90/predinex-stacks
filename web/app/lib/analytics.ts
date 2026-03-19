// Lightweight analytics helpers (no PII)
export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  console.debug("[analytics]", name, props);
}

export const EVENTS = {
  POOL_CREATED: "pool_created",
  BET_PLACED: "bet_placed",
  WINNINGS_CLAIMED: "winnings_claimed",
  DISPUTE_FILED: "dispute_filed",
} as const;
