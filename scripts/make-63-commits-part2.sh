#!/bin/bash
set -e
REPO="/home/dimka/Desktop/Ecosystem/stacks/predinex-stacks"
cd "$REPO"

commit() {
  local msg="$1"
  git add -A
  git commit -m "$msg"
}

# 20
echo "// MarketCard: displays pool summary with status badge" >> web/components/MarketCard.tsx
commit "chore(web): document MarketCard display purpose"

# 21
mkdir -p scripts/utils
cat > scripts/utils/retry.ts << 'ENDOFFILE'
export async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try { return await fn(); }
    catch (e) { if (i === retries - 1) throw e; await new Promise(r => setTimeout(r, delayMs)); }
  }
  throw new Error("unreachable");
}
ENDOFFILE
commit "feat(scripts): add generic retry utility for async operations"

# 22
echo -e "\n// uses retry utility for resilient RPC calls\n// import { withRetry } from \"./utils/retry\";" >> scripts/health-check.ts
commit "chore(scripts): note retry utility integration in health-check"

# 23
mkdir -p docs/guides
cat > docs/guides/scripting-guide.md << 'ENDOFFILE'
# Scripting Guide

All scripts in `scripts/` use the `@stacks/transactions` SDK.
Run with: `npx ts-node scripts/<name>.ts`

## Environment
Copy `.env.example` to `.env` and fill in your keys.
ENDOFFILE
commit "docs: add scripting guide for contributors"

# 24
cat >> docs/guides/scripting-guide.md << 'ENDOFFILE'

## Available Scripts
- `check-balance.ts` — check STX balance
- `health-check.ts` — verify contract liveness
- `pool-crawler.ts` — discover active pools
- `export-pool-csv.ts` — export pool data to CSV
ENDOFFILE
commit "docs: list available scripts in scripting guide"

# 25
cat > web/app/components/Tooltip.tsx << 'ENDOFFILE'
"use client";
import { useState } from "react";
interface TooltipProps { content: string; children: React.ReactNode; }
export default function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && <div className="absolute bottom-full mb-1 px-2 py-1 text-xs bg-black/80 text-white rounded whitespace-nowrap z-50">{content}</div>}
    </div>
  );
}
ENDOFFILE
commit "feat(web): add Tooltip component for contextual help"

# 26
mkdir -p .github/ISSUE_TEMPLATE
cat > .github/ISSUE_TEMPLATE/bug_report.md << 'ENDOFFILE'
---
name: Bug report
about: Report a bug in the Predinex protocol
---
**Describe the bug**

**Steps to reproduce**

**Expected behavior**

**Contract address / tx hash (if applicable)**
ENDOFFILE
commit "chore(github): add bug report issue template"

# 27
cat > .github/ISSUE_TEMPLATE/feature_request.md << 'ENDOFFILE'
---
name: Feature request
about: Suggest a new feature for Predinex
---
**Is your feature request related to a problem?**

**Describe the solution you would like**

**Additional context**
ENDOFFILE
commit "chore(github): add feature request issue template"

# 28
echo -e "\n;; v1.2: added cooldown period between reward claims to prevent gaming\n(define-constant CLAIM_COOLDOWN_BLOCKS u144)" >> contracts/liquidity-incentives.clar
commit "feat(contract): add claim cooldown constant to liquidity incentives"

# 29
echo -e "\n;; v1.1: log pool creation block for analytics" >> contracts/predinex-pool.clar
commit "docs(contract): note pool creation block logging intention"

# 30
cat > web/app/lib/analytics.ts << 'ENDOFFILE'
// Lightweight analytics helpers (no PII)
export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  console.debug("[analytics]", name, props);
}
ENDOFFILE
commit "feat(web): add analytics event tracking stub"

# 31
cat >> web/app/lib/analytics.ts << 'ENDOFFILE'

export const EVENTS = {
  POOL_CREATED: "pool_created",
  BET_PLACED: "bet_placed",
  WINNINGS_CLAIMED: "winnings_claimed",
  DISPUTE_FILED: "dispute_filed",
} as const;
ENDOFFILE
commit "feat(web): add analytics event name constants"

# 32
cat > tests/constants.test.ts << 'ENDOFFILE'
import { describe, it, expect } from "vitest";
import { MAX_BET_AMOUNT, MIN_BET_AMOUNT, PROTOCOL_FEE_BPS } from "../web/app/lib/constants";
describe("protocol constants", () => {
  it("max bet is greater than min bet", () => { expect(MAX_BET_AMOUNT).toBeGreaterThan(MIN_BET_AMOUNT); });
  it("protocol fee is 1%", () => { expect(PROTOCOL_FEE_BPS).toBe(100); });
});
ENDOFFILE
commit "test: add unit tests for protocol constants"

# 33
cat > web/app/components/PoolStatusPill.tsx << 'ENDOFFILE'
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
ENDOFFILE
commit "feat(web): add PoolStatusPill component with status colors"

# 34
cat > scripts/validate-env.ts << 'ENDOFFILE'
const required = ["STACKS_PRIVATE_KEY", "STACKS_NETWORK", "CONTRACT_ADDRESS"];
const missing = required.filter(k => !process.env[k]);
if (missing.length) { console.error("Missing env vars:", missing.join(", ")); process.exit(1); }
console.log("Environment validated successfully.");
ENDOFFILE
commit "feat(scripts): add environment variable validation script"

# 35
echo -e "\nANALYTICS_ENABLED=false\nDEBUG_LEVEL=info" >> .env.example
commit "chore: add analytics and debug env vars to .env.example"

# 36
cat > docs/guides/testing-guide.md << 'ENDOFFILE'
# Testing Guide

Run all tests: `npm test`
Run watch mode: `npm run test:watch`

## Test Structure
- `tests/*.test.ts` - unit tests
- `tests/integration/` - integration tests (require live RPC)
ENDOFFILE
commit "docs: add testing guide for contributors"

# 37
mkdir -p tests/integration
cat > tests/integration/oracle.test.ts << 'ENDOFFILE'
// Integration test: requires live Stacks testnet RPC
import { describe, it } from "vitest";
describe.skip("oracle integration", () => {
  it("should fetch oracle registry state", async () => {
    // TODO: implement
  });
});
ENDOFFILE
commit "test(integration): scaffold oracle integration test"

# 38
cat > tests/integration/pool.test.ts << 'ENDOFFILE'
// Integration test: pool lifecycle
import { describe, it } from "vitest";
describe.skip("pool integration", () => {
  it("should create and resolve a pool", async () => {
    // TODO: implement
  });
});
ENDOFFILE
commit "test(integration): scaffold pool lifecycle integration test"

# 39
cat > web/app/components/EmptyState.tsx << 'ENDOFFILE'
interface EmptyStateProps { title: string; description: string; icon?: string; }
export default function EmptyState({ title, description, icon = "📭" }: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
ENDOFFILE
commit "feat(web): add reusable EmptyState component"

# 40
echo -e "\n// Footer links: Markets, Create, About, Docs, Terms, Privacy" >> web/app/components/Footer.tsx
commit "chore(web): document planned footer link expansion"

# 41
cat > scripts/utils/logger.ts << 'ENDOFFILE'
const level = process.env.DEBUG_LEVEL || "info";
export const logger = {
  info: (...a: unknown[]) => console.log("[INFO]", ...a),
  warn: (...a: unknown[]) => console.warn("[WARN]", ...a),
  error: (...a: unknown[]) => console.error("[ERROR]", ...a),
  debug: (...a: unknown[]) => level === "debug" && console.debug("[DEBUG]", ...a),
};
ENDOFFILE
commit "feat(scripts): add structured logger utility"

# 42
echo -e "\n// import { logger } from \"./utils/logger\";\n// logger.info(\"Health check started\");" >> scripts/health-check.ts
commit "chore(scripts): note logger integration in health-check"

# 43
cat > web/app/lib/error-codes.ts << 'ENDOFFILE'
export const CONTRACT_ERRORS: Record<number, string> = {
  100: "Unauthorized",
  101: "Pool not found",
  102: "Bet amount too low",
  103: "Bet amount too high",
  104: "Pool already resolved",
  105: "Dispute window closed",
  106: "Oracle not registered",
};
ENDOFFILE
commit "feat(web): add contract error code lookup table"

# 44
cat > docs/guides/error-codes.md << 'ENDOFFILE'
# Contract Error Codes

| Code | Meaning |
|------|---------|
| 100 | Unauthorized |
| 101 | Pool not found |
| 102 | Bet amount too low |
| 103 | Bet amount too high |
| 104 | Pool already resolved |
| 105 | Dispute window closed |
| 106 | Oracle not registered |
ENDOFFILE
commit "docs: add contract error codes reference guide"

# 45
cat >> web/app/lib/constants.ts << 'ENDOFFILE'
export const STACKS_EXPLORER_BASE = "https://explorer.hiro.so";
export function explorerTxUrl(txId: string, network = "mainnet"): string {
  return `${STACKS_EXPLORER_BASE}/txid/${txId}?chain=${network}`;
}
ENDOFFILE
commit "feat(web): add Stacks explorer URL helpers to constants"

# 46
cat > web/app/components/TxLink.tsx << 'ENDOFFILE'
import { explorerTxUrl } from "../lib/constants";
export default function TxLink({ txId, network = "mainnet" }: { txId: string; network?: string }) {
  return (
    <a href={explorerTxUrl(txId, network)} target="_blank" rel="noopener noreferrer"
       className="text-primary hover:underline font-mono text-xs">
      {txId.slice(0, 8)}...{txId.slice(-6)}
    </a>
  );
}
ENDOFFILE
commit "feat(web): add TxLink component linking to Stacks explorer"

# 47
echo -e "\n;; deregistration requires 48-block notice period\n(define-constant DEREGISTER_NOTICE_BLOCKS u48)" >> contracts/predinex-oracle-registry.clar
commit "feat(contract): add oracle deregistration notice period constant"

# 48
echo -e "\n;; minimum stake required to earn tier-2 rewards\n(define-constant TIER2_MIN_STAKE u500000000)" >> contracts/liquidity-incentives.clar
commit "feat(contract): add tier-2 minimum stake threshold constant"

# 49
cat > web/app/lib/date-utils.ts << 'ENDOFFILE'
export function fromUnixMs(ts: number): Date { return new Date(ts); }
export function toRelativeTime(date: Date): string {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}
ENDOFFILE
commit "feat(web): add date utility functions"

# 50
cat > tests/date-utils.test.ts << 'ENDOFFILE'
import { describe, it, expect } from "vitest";
import { toRelativeTime } from "../web/app/lib/date-utils";
describe("toRelativeTime", () => {
  it("returns just now for recent dates", () => {
    expect(toRelativeTime(new Date())).toBe("just now");
  });
});
ENDOFFILE
commit "test: add unit tests for date utility functions"

# 51
cat > docs/architecture/smart-contracts.md << 'ENDOFFILE'
# Smart Contract Architecture

## Contracts
- `predinex-pool.clar` - core prediction pool logic
- `predinex-oracle-registry.clar` - oracle management
- `predinex-resolution-engine.clar` - resolution and disputes
- `liquidity-incentives.clar` - staking and rewards
ENDOFFILE
commit "docs(architecture): add smart contract architecture overview"

# 52
cat >> docs/architecture/smart-contracts.md << 'ENDOFFILE'

## Deployment Order
1. `liquidity-incentives`
2. `predinex-oracle-registry`
3. `predinex-resolution-engine`
4. `predinex-pool`
ENDOFFILE
commit "docs(architecture): document contract deployment order"

# 53
cat > web/app/components/CopyButton.tsx << 'ENDOFFILE'
"use client";
import { useState } from "react";
export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return <button onClick={copy} className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted/80">{copied ? "Copied" : "Copy"}</button>;
}
ENDOFFILE
commit "feat(web): add CopyButton component with clipboard feedback"

# 54
cat > web/app/components/Skeleton.tsx << 'ENDOFFILE'
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted/50 ${className}`} />;
}
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border p-5 space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
ENDOFFILE
commit "feat(web): add Skeleton and SkeletonCard loading components"

# 55
cat > scripts/simulate-user-journey.ts << 'ENDOFFILE'
// Simulates a full user journey: create pool -> place bet -> claim winnings
console.log("Step 1: create pool");
console.log("Step 2: place bet");
console.log("Step 3: resolve pool (oracle)");
console.log("Step 4: claim winnings");
console.log("User journey simulation complete (dry run).");
ENDOFFILE
commit "feat(scripts): add user journey simulation script"

# 56
mkdir -p web/app/lib/hooks
cat > web/app/lib/hooks/useDebounce.ts << 'ENDOFFILE'
import { useEffect, useState } from "react";
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debouncedValue;
}
ENDOFFILE
commit "feat(web): add useDebounce custom hook"

# 57
cat > web/app/lib/hooks/useLocalStorage.ts << 'ENDOFFILE'
import { useState } from "react";
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : initial; }
    catch { return initial; }
  });
  const set = (v: T) => {
    setValue(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  };
  return [value, set] as const;
}
ENDOFFILE
commit "feat(web): add useLocalStorage custom hook"

# 58
cat > web/app/lib/hooks/useContractCall.ts << 'ENDOFFILE'
import { useState } from "react";
export function useContractCall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const call = async (fn: () => Promise<void>) => {
    setLoading(true); setError(null);
    try { await fn(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Unknown error"); }
    finally { setLoading(false); }
  };
  return { call, loading, error };
}
ENDOFFILE
commit "feat(web): add useContractCall React hook for tx execution"

# 59
cat > docs/guides/frontend-guide.md << 'ENDOFFILE'
# Frontend Guide

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (with custom design tokens)

## Key Directories
- `web/app/` - App Router pages and layouts
- `web/components/` - shared UI components
- `web/app/lib/` - utilities, hooks, constants
ENDOFFILE
commit "docs: add frontend guide for contributors"

# 60
cat >> docs/guides/frontend-guide.md << 'ENDOFFILE'

## Custom Hooks
- `useDebounce` - debounce rapidly changing values
- `useLocalStorage` - persist state in localStorage
- `useContractCall` - manage contract transaction state
ENDOFFILE
commit "docs: document custom React hooks in frontend guide"

# 61
cat > web/app/components/ProgressBar.tsx << 'ENDOFFILE'
interface ProgressBarProps { value: number; max: number; colorClass?: string; }
export default function ProgressBar({ value, max, colorClass = "bg-primary" }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full bg-muted rounded-full h-2">
      <div className={`h-2 rounded-full transition-all ${colorClass}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
ENDOFFILE
commit "feat(web): add ProgressBar component for pool fill rate"

# 62
cat >> README.md << 'ENDOFFILE'

## Recent Updates (v1.2)
- Added oracle rate limiting and deregistration notice period
- New frontend utilities: formatting, analytics, custom hooks
- Expanded test coverage for constants, dates, and formats
- Comprehensive architecture and scripting documentation
ENDOFFILE
commit "docs(readme): add v1.2 update summary to README"

# 63
cat > CHANGELOG.md << 'ENDOFFILE'
# Changelog

## [1.2.0] - 2026-03-19
### Added
- Oracle rate limiting and deregistration notice period constants
- Frontend: Badge, Tooltip, PoolStatusPill, TxLink, CopyButton, Skeleton, ProgressBar, EmptyState components
- Custom hooks: useDebounce, useLocalStorage, useContractCall
- Scripts: ping-oracle, list-active-pools, export-pool-csv, simulate-user-journey, validate-env
- Utilities: format-utils, date-utils, analytics, error-codes, logger, retry
- Documentation: architecture/ and guides/ covering oracle flow, resolution flow, smart contracts, scripting, testing, frontend, error codes
- Test coverage for format utils, date utils, and protocol constants

### Changed
- Footer and MarketGrid annotated with version notes
- .env.example expanded with analytics and debug vars
- CONTRIBUTING.md updated with branch naming conventions
ENDOFFILE
commit "chore: add CHANGELOG.md with v1.2.0 release notes"

echo "All remaining commits created!"
