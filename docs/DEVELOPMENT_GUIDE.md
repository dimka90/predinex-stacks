# Development Guide

This guide provides instructions for setting up the Predinex development environment and contributing to the project.

## Prerequisites

- **Clarinet**: For Stacks smart contract development and testing.
- **Node.js (v18+)**: For frontend and script development.
- **Git**: For version control.

## Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd predinex-stacks
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    cd web && npm install
    ```

3.  **Configure environment**:
    Copy `.env.example` to `.env` and fill in the required variables (Private keys, API keys).

## Smart Contract Development

- **Testing**: Run `npm run test` to execute the Vitest suite.
- **Console**: Use `clarinet console` to interact with contracts in a local regtest environment.
- **Deployment**: Use the scripts in `scripts/` for mainnet or testnet deployments.

## Frontend Development

- **Dev Server**: Run `npm run dev` in the `web/` directory.
- **Build**: Run `npm run build` to verify the production bundle.
- **Linting**: Ensure code quality with `npm run lint`.

## Contribution Guidelines

1.  Create a feature branch for your changes.
2.  Follow the established granular commit pattern.
3.  Ensure all tests pass before submitting a Pull Request.
4.  Update documentation in `docs/` if you introduce new features or contract functions.

## Build Optimization

### Next.js Performance
- Use `next/dynamic` for code-splitting heavy components like `MarketChart` and `OrderBook`.
- Keep `'use client'` directives on the smallest possible component boundary.
- Use `next/image` for optimized image loading.

### Bundle Analysis
```bash
cd web && ANALYZE=true npm run build
```

### Type Checking
```bash
cd web && npx tsc --noEmit
```

## Environment Variables

| Variable | Description | Required |
| :--- | :--- | :--- |
| `PRIVATE_KEY` | Deployer wallet private key | Yes |
| `DEPLOYER_KEY` | Alias for `PRIVATE_KEY` | No |
| `STACKS_NETWORK` | `mainnet` or `testnet` | No (default: `mainnet`) |
| `NEXT_PUBLIC_NETWORK` | Network for frontend | No (default: `mainnet`) |

## Useful Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build production bundle |
| `npx ts-node scripts/deploy.ts` | Deploy contracts to configured network |
| `npx ts-node scripts/check-balance.ts` | Check deployer STX balance |
| `npx ts-node scripts/health-check.ts` | Run protocol health diagnostics |
