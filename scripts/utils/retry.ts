export async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try { return await fn(); }
    catch (e) { if (i === retries - 1) throw e; await new Promise(r => setTimeout(r, delayMs)); }
  }
  throw new Error("unreachable");
}
