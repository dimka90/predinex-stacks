# Predinex Smart Contract Tests

Unit tests for all 5 smart contracts using `@stacks/clarinet-sdk` + `vitest`.

## Contracts Covered

| Contract | Functions Tested |
|---|---|
| `predinex-pool` | `create-pool`, `place-bet`, `settle-pool`, `claim-winnings`, `cancel-pool` |
| `predinex-oracle-registry` | `register-oracle-provider-with-stake`, `submit-enhanced-oracle-data`, `slash-provider-stake`, `trigger-circuit-breaker`, `deactivate-oracle-provider` |
| `predinex-resolution-engine` | `configure-pool-resolution`, `create-dispute`, `vote-on-dispute`, `resolve-dispute` |
| `liquidity-incentives` | `initialize-pool-incentives`, `record-bet-and-calculate-early-bird`, `award-volume-bonus`, `award-referral-bonus`, `claim-incentive` |
| `metric-booster` | `pulse`, `pulse-n`, `toggle-pause` |

## Run Tests

```bash
npm test
```
