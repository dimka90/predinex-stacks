# API Reference

This document provides a reference for the public and read-only functions available in the Predinex Stacks smart contracts.

## `predinex-pool`

### Public Functions

- **`create-pool (title, description, outcome-a, outcome-b, duration)`**: Creates a new prediction market.
- **`place-bet (pool-id, outcome, amount)`**: Places a bet on a specific outcome (0 for A, 1 for B).
- **`settle-pool (pool-id, winning-outcome)`**: Declares the winner and settles the pool (Creator/Admin only).
- **`claim-winnings (pool-id)`**: Allows winners to claim their share of the pool.

### Read-Only Functions

- **`get-pool-details (pool-id)`**: Returns the full state of a pool.
- **`get-user-bet (pool-id, user)`**: Returns a user's bet amounts for a specific pool.
- **`get-pool-counter`**: Returns the current number of pools created.

## `predinex-oracle-registry`

### Public Functions

- **`register-oracle-provider (address, supported-types)`**: Registers a new oracle (Admin only).
- **`submit-oracle-data (pool-id, value, type, confidence)`**: Submits external data for pool resolution.

### Read-Only Functions

- **`get-provider-details (provider-id)`**: Returns oracle registration details.
- **`get-provider-id-by-address (address)`**: Maps an address to its provider ID.

## Common Error Codes

| Error Code | Name | Description |
| :--- | :--- | :--- |
| `u400` | `ERR-INVALID-AMOUNT` | The provided STX amount is below the minimum or invalid. |
| `u401` | `ERR-UNAUTHORIZED` | The caller does not have permission for the action. |
| `u404` | `ERR-POOL-NOT-FOUND` | The specified pool ID does not exist. |
| `u409` | `ERR-POOL-SETTLED` | The pool has already been settled. |
| `u410` | `ERR-ALREADY-CLAIMED` | The user has already claimed their winnings/incentives. |
| `u411` | `ERR-NO-WINNINGS` | The user is not eligible for winnings in the specified pool. |
| `u412` | `ERR-NOT-SETTLED` | The pool must be settled before this action can be taken. |
| `u430` | `ERR-ORACLE-NOT-FOUND` | The oracle provider is not registered. |
| `u431` | `ERR-ORACLE-INACTIVE` | The oracle provider is currently deactivated. |
| `u444` | `ERR-ALREADY-VOTED` | The user has already cast a vote in this dispute. |

## `predinex-resolution-engine`

### Public Functions

- **`attempt-enhanced-resolution (pool-id)`**: Attempts automated resolution using oracle consensus data.
- **`configure-advanced-resolution (pool-id, min-oracles, min-reputation)`**: Sets custom oracle requirements per market.
- **`submit-dispute (pool-id, reason)`**: Initiates a community dispute against an automated settlement.
- **`vote-on-dispute (pool-id, vote)`**: Casts a vote in an active dispute (1 = support, 0 = reject).

### Read-Only Functions

- **`get-resolution-status (pool-id)`**: Returns the resolution state and oracle data for a pool.
- **`get-dispute-details (pool-id)`**: Returns active dispute vote counts and status.

## `liquidity-incentives`

### Public Functions

- **`initialize-pool-incentives (pool-id)`**: Initializes the incentive structure for a new pool.
- **`claim-incentive (pool-id)`**: Claims earned incentives after the vesting period.
- **`adjust-bonus-rates (pool-id, early-bird, volume, referral, loyalty)`**: Adjusts dynamic bonus percentages (Owner only).

### Read-Only Functions

- **`get-top-earners (pool-id)`**: Returns the leaderboard of top incentive earners.
- **`calculate-vesting-schedule (pool-id, user)`**: Returns vesting progress and claimable amount.
- **`get-leaderboard-analytics (pool-id)`**: Returns participation and earning statistics.

