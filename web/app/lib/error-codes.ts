export const CONTRACT_ERRORS: Record<number, string> = {
  // Core pool errors
  100: "Unauthorized",
  101: "Pool not found",
  102: "Bet amount too low",
  103: "Bet amount too high",
  104: "Pool already resolved",
  105: "Dispute window closed",
  106: "Oracle not registered",

  // Settlement errors
  200: "Settlement already finalized",
  201: "Invalid winning outcome",
  202: "Insufficient pool balance for settlement",
  203: "Settlement cooldown not elapsed",
  204: "Creator-only settlement restricted",

  // Oracle errors
  300: "Oracle stake insufficient",
  301: "Oracle reputation too low",
  302: "Data submission expired",
  303: "Oracle already submitted",
  304: "Circuit breaker active",
  305: "Collusion detected",

  // Incentive errors
  400: "Incentive not initialized",
  401: "Vesting period incomplete",
  402: "No incentive to claim",
  403: "Bonus rate out of range",
  404: "Pool incentives already configured",
};

/**
 * Returns a human-readable error message for a contract error code.
 */
export function getContractErrorMessage(code: number): string {
  return CONTRACT_ERRORS[code] || `Unknown error (code: ${code})`;
}
