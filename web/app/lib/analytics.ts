// Lightweight analytics helpers (no PII)
export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  console.debug("[analytics]", name, props);
}
