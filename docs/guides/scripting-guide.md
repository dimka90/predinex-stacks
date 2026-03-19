# Scripting Guide

All scripts in `scripts/` use the `@stacks/transactions` SDK.
Run with: `npx ts-node scripts/<name>.ts`

## Environment
Copy `.env.example` to `.env` and fill in your keys.

## Available Scripts
- `check-balance.ts` — check STX balance
- `health-check.ts` — verify contract liveness
- `pool-crawler.ts` — discover active pools
- `export-pool-csv.ts` — export pool data to CSV
