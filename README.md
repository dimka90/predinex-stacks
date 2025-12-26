# Predinex Stacks - Decentralized Prediction Market

Predinex is a decentralized prediction market built on the Stacks blockchain. It allows users to create prediction pools, place bets on binary outcomes (e.g., "Yes" vs "No"), and settle markets in a transparent and trustless manner using Clarity smart contracts.

**🆕 NEW: Automated Market Resolution System** - Markets can now be settled automatically using oracle data feeds, with community dispute mechanisms and fallback options.

![Stacks](https://img.shields.io/badge/Stacks-Blockchain-blueviolet?style=flat-square) ![Clarity](https://img.shields.io/badge/Language-Clarity-orange?style=flat-square) ![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)

## 🏗 System Architecture

The project consists of a Clarity smart contract (`predinex-pool`) that manages the state of all prediction pools and funds. Users interact with the contract directly or through TypeScript scripts/frontend applications.

```mermaid
graph TD
    User[User / Client]
    
    subgraph Stacks_Blockchain [Stacks Blockchain]
        Contract[predinex-pool.clar]
        State[Contract State]
    end
    
    subgraph Storage [On-Chain Storage]
        Pools[Pools Map]
        Bets[User Bets Map]
    end

    User -- "Create Pool" --> Contract
    User -- "Place Bet (STX)" --> Contract
    User -- "Settle Pool" --> Contract
    
    Contract -- Read/Write --> Pools
    Contract -- Read/Write --> Bets
    Contract -- Updates --> State
```

## 🔄 Workflow

The lifecycle of a prediction pool follows a linear flow from creation to settlement.

```mermaid
stateDiagram-v2
    [*] --> Created: create-pool
    
    state Created {
        [*] --> BettingOpen
        BettingOpen --> BettingOpen: place-bet (Outcome A or B)
    }
    
    Created --> Settled: settle-pool (Owner Only)
    
    state Settled {
        [*] --> FundsDistributed
        note right of FundsDistributed
          Winner is declared
          Marked as settled
        end note
    }
    
    Settled --> [*]
```

## ✨ Features

- **Create Prediction Pools**: Anyone creating a pool can define the title, description, and two outcomes.
- **Binary Betting**: Users can bet STX on one of two outcomes (Outcome A or Outcome B).
- **Automated Bookkeeping**: The contract tracks total bets for each side and individual user positions.
- **🆕 Automated Resolution**: Markets can be settled automatically using oracle data feeds.
- **🆕 Oracle System**: Decentralized oracle providers submit external data for market resolution.
- **🆕 Dispute Mechanism**: Community-driven dispute resolution for contested automated settlements.
- **🆕 Fee Distribution**: Automatic fee distribution to oracle providers and platform.
- **🆕 Fallback Resolution**: Manual settlement when automated systems fail.
- **Settlement**: The pool creator can settle the market, determining the winning outcome (functionality for claiming winnings would be the logical next step).
- **Transparency**: All pool data, bets, and results are publicly verifiable on the Stacks blockchain.

## 🛠 Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+)
- [Clarinet](https://github.com/hirosystems/clarinet) (for local Clarinet orchestration)
- [Git](https://git-scm.com/)

## 🚀 Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd predinex-stacks
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

## 🧪 Testing

This project uses Vitest with `vitest-environment-clarinet` for comprehensive unit testing.

To run the tests:

```bash
npm run test
```

To generate a coverage report:

```bash
npm run test:report
```

## 📜 Deployment

The project includes scripts to facilitate deployment to the Stacks network (Testnet/Mainnet).

1.  **Configure Environment**
    Ensure your `.env` file is set up with your deployer key and network settings.

2.  **Run Deploy Script**
    ```bash
    npm run deploy
    ```

## 💻 Usage

You can also interact with the contract using the provided interaction script:

```bash
npm run interact
```

### 🆕 Automated Resolution System

The new automated resolution system allows markets to be settled without manual intervention:

#### Oracle Provider Setup
```bash
# Test oracle system
npm run test:oracle

# Simulate oracle providers
npx tsx scripts/simulate-oracle-provider.ts

# API integration example
npx tsx scripts/api-integration-example.ts
```

#### Dispute System Testing
```bash
# Test dispute mechanisms
npx tsx scripts/simulate-dispute-system.ts
```

#### Performance Monitoring
```bash
# Monitor system performance
npx tsx scripts/performance-monitor.ts
```

#### Complete Integration Test
```bash
# Run full system integration test
npx tsx scripts/final-integration-test.ts
```

For detailed documentation on the automated resolution system, see [AUTOMATED_RESOLUTION_GUIDE.md](./AUTOMATED_RESOLUTION_GUIDE.md).

### Smart Contract Functions

| Function | Type | Description |
| :--- | :--- | :--- |
| `create-pool` | Public | Creates a new prediction market pool. |
| `place-bet` | Public | Places a bet on Outcome A (0) or Outcome B (1). |
| `settle-pool` | Public | Settles the pool and declares a winner (Creator only). |
| `get-pool` | Read-Only | Retrieves details of a specific pool. |
| `get-user-bet` | Read-Only | Retrieves a user's betting position for a pool. |

### 🆕 Automated Resolution Functions

| Function | Type | Description |
| :--- | :--- | :--- |
| `register-oracle-provider` | Public | Registers a new oracle provider (Admin only). |
| `submit-oracle-data` | Public | Submits data for market resolution (Oracle only). |
| `configure-pool-resolution` | Public | Configures automated resolution for a pool. |
| `attempt-automated-resolution` | Public | Attempts to resolve a pool using oracle data. |
| `create-dispute` | Public | Creates a dispute for an automated resolution. |
| `vote-on-dispute` | Public | Votes on a disputed resolution. |
| `resolve-dispute` | Public | Resolves a dispute after voting period. |
| `trigger-fallback-resolution` | Public | Triggers manual resolution fallback. |
| `collect-resolution-fee` | Public | Collects fees for automated resolution. |
| `claim-oracle-fee` | Public | Allows oracles to claim their fees. |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.