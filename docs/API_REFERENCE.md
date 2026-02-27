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
