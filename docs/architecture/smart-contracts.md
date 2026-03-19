# Smart Contract Architecture

## Contracts
- `predinex-pool.clar` - core prediction pool logic
- `predinex-oracle-registry.clar` - oracle management
- `predinex-resolution-engine.clar` - resolution and disputes
- `liquidity-incentives.clar` - staking and rewards

## Deployment Order
1. `liquidity-incentives`
2. `predinex-oracle-registry`
3. `predinex-resolution-engine`
4. `predinex-pool`
