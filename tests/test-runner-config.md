# Test Runner Configuration

Tests use `vitest` with the `clarinet` environment via `@stacks/clarinet-sdk`.

## Setup

The `vitest.config.ts` at the root configures:
- `environment: "clarinet"` — loads simnet automatically
- `pool: "forks"` — each test file gets an isolated simnet fork
- `isolate: false` — shares the simnet instance within a file
- `maxWorkers: 1` — prevents race conditions across contract state

## Contract Deployment Order

Clarinet deploys contracts in the order defined in `Clarinet.toml`. The test suite
depends on this order since `predinex-pool` calls into `liquidity-incentives` on
pool creation. Always ensure `liquidity-incentives` is deployed before `predinex-pool`.

## beforeEach Pattern

Most test files call `set-authorized-contract` in `beforeEach` to wire up the
`liquidity-incentives` contract to accept calls from `predinex-pool`. This mirrors
the production deployment setup.
