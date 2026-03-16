# Predinex Automation & Utility Scripts

This directory contains a comprehensive suite of TypeScript and Bash scripts for managing, deploying, and monitoring the Predinex platform on the Stacks network.

## 🚀 Getting Started

Most scripts can be executed using `ts-node`. Ensure you have your environment variables configured in a `.env` file at the project root.

```bash
# Example: Running the health check
npx ts-node scripts/health-check.ts
```

## 🛠️ Deployment Utilities

These scripts handle the complex orchestration of deploying Predinex smart contracts.

- **`deploy.ts`**: Standard entry point for contract deployments.
- **`deploy-reliable.ts`**: Enhanced deployment script with robust error handling and retry logic.
- **`deploy-dependencies.sh`**: Bash orchestrator for environment setup and multi-contract ordering.
- **`verify-deployment.ts`**: Post-deployment verification to ensure on-chain state matches local configuration.

## 📊 Diagnostic & Monitoring

Utilities for real-time system health and account status auditing.

- **`health-check.ts`**: Verifies reachability and responsiveness of all core smart contracts.
- **`check-balance.ts`**: Batch validate the STX balances and nonces of platform operators.
- **`monitor-events.ts`**: Listens for and logs on-chain events from the Predinex contracts.
- **`analyze-transactions.ts`**: Generates reports based on historical transaction volume and fee impact.

## 🔮 Market & Oracle Simulation

Tools to simulate platform activity and oracle data feeds for testing and metrics.

- **`simulate-oracle-provider.ts`**: Feeds mock price data into the oracle registry.
- **`generate-activity.ts`**: Orchestrates a variety of platform interactions to simulate organic growth.
- **`bulk-bets.ts`**: Utility for high-volume bet simulations to test contract congestion limits.
- **`test-resolution.sh`**: End-to-end automated test for market settlement and reward distribution.

## 📦 Batch Operations

High-efficiency scripts for managing multiple markets and bets in single blocks.

- **`batch-interact.ts`**: Orchestrates multiple contract interactions to save on latency.
- **`batch-settle.ts`**: Aggregates settlement calls for mature markets to optimize fee spending.
- **`bulk-bets.ts`**: Facilitates the placement of multiple bets across different pools.
- **`create-pools-nonce-managed.ts`**: Highly reliable market creation utility with advanced nonce management.

---
