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
