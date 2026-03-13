# Predinex Scripting Guide

This guide covers the automation tools and utility scripts available in the Predinex ecosystem.

## Core Utilities

### Pool Discovery
`scripts/pool-crawler.ts`: Recursively discovers on-chain prediction pools.
```bash
npx ts-node scripts/pool-crawler.ts
```

### Health Monitoring
`scripts/health-check.ts`: Verifies reachability and state of all core contracts.
```bash
npx ts-node scripts/health-check.ts
```

### Dispute Management
`scripts/dispute-monitor.ts`: Watches for new disputes and files automated responses.
```bash
npx ts-node scripts/dispute-monitor.ts
```

## Advanced Tools

### Batch Betting
`scripts/batch-bet.ts`: Optimizes gas usage by grouping multiple bet transactions.

### Performance Analytics
`scripts/oracle-stats.ts`: Analyzes oracle accuracy and response times.
`scripts/liquidity-depth.ts`: Measures slippage and depth across prediction outcomes.

### Revenue Management
`scripts/distribute-revenue.ts`: Automates protocol fee distribution to stakeholders.
