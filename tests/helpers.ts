import { Cl } from '@stacks/transactions';

/**
 * Shared test helpers for Predinex contract tests
 */

const accounts = simnet.getAccounts();
export const deployer = accounts.get('deployer')!;
export const wallet1 = accounts.get('wallet_1')!;
export const wallet2 = accounts.get('wallet_2')!;
export const wallet3 = accounts.get('wallet_3')!;

/** Authorize predinex-pool as the liquidity-incentives caller */
export function authorizePool() {
  simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
    [Cl.principal(deployer + '.predinex-pool')], deployer);
}

/** Create a pool and return its id */
export function createPool(title = 'Test Pool', creator = deployer): bigint {
  authorizePool();
  const { result } = simnet.callPublicFn('predinex-pool', 'create-pool', [
    Cl.stringAscii(title),
    Cl.stringAscii('Test description'),
    Cl.stringAscii('Yes'),
    Cl.stringAscii('No'),
    Cl.uint(1000)
  ], creator);
  return (result as any).value.value as bigint;
}

/** Register an oracle provider and return its id */
export function registerOracle(address: string, admin = deployer): bigint {
  const { result } = simnet.callPublicFn('predinex-oracle-registry',
    'register-oracle-provider-with-stake', [
      Cl.principal(address),
      Cl.uint(1000000000),
      Cl.list([Cl.stringAscii('BTC-USD')]),
      Cl.stringAscii('https://provider.example.com')
    ], admin);
  return (result as any).value.value as bigint;
}

/** Place a bet on a pool */
export function placeBet(poolId: number, outcome: number, amount: number, user: string) {
  return simnet.callPublicFn('predinex-pool', 'place-bet', [
    Cl.uint(poolId), Cl.uint(outcome), Cl.uint(amount)
  ], user);
}

/** Settle a pool */
export function settlePool(poolId: number, outcome: number, settler = deployer) {
  return simnet.callPublicFn('predinex-pool', 'settle-pool', [
    Cl.uint(poolId), Cl.uint(outcome)
  ], settler);
}
