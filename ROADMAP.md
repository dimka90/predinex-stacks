# Predinex Stacks - Development Roadmap

This document outlines the planned features and improvements for the Predinex Prediction Market.

- [x] **Data Validation**: Ensure pool creation parameters (dates, names) are valid.
- [x] **Claim Winnings**: Implement functionality for winners to withdraw their share of the pool. is cancelled or not settled by an expiry date.

## Phase 2: Economics & Incentives
- [x] **Platform Fees**: precise mechanism to take a small percentage (e.g., 2%) of the winning pool as a protocol fee.
- [x] **Liquidity Incentives**: Rewards for early bettors to bootstrap pools.

## Phase 3: Advanced Market Features
- [ ] **Multiple Outcomes**: Support for more than just binary (Yes/No) options.
- [ ] **Oracle Integration**: Automated settlement using trusted off-chain data (e.g., Pyth or Chainlink via Stacks).
- [ ] **Dispute Resolution**: A mechanism to challenge a settlement if the pool creator acts maliciously.

## Phase 4: User Interface (Frontend)
- [ ] **Web App**: Next.js application to interact with the contracts.
- [ ] **Wallet Connection**: Integration with Leather/Xverse wallets.
- [ ] **Dashboard**: User stats, active bets, and history.

## Phase 5: Testing & Security
- [ ] **Audit Prep**: Comprehensive code analysis and cleanup.
- [ ] **Stress Testing**: Simulating high volume betting.
