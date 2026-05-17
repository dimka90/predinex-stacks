import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';
import { authorizePool, createPool, deployer, wallet1, wallet2, wallet3 } from './helpers';

/**
 * Tests for predinex-pool: place-bet
 * Covers the core betting logic on the Stacks blockchain
 */
describe('predinex-pool: place-bet', () => {
  let poolId: bigint;

  beforeEach(() => {
    poolId = createPool('BTC Price Prediction', wallet1);
  });

  // ─── Success Cases ────────────────────────────────────────────────────────

  it('places a bet on outcome 0 and returns true', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(poolId), Cl.uint(0), Cl.uint(10000)
    ], wallet2);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('places a bet on outcome 1 and returns true', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(poolId), Cl.uint(1), Cl.uint(10000)
    ], wallet2);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('updates pool total-a after outcome 0 bet', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(poolId), Cl.uint(0), Cl.uint(50000)
    ], wallet2);
    const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-pool-bet-info',
      [Cl.uint(poolId)], deployer);
    const info = (result as any).value;
    expect(info['total-a'].value).toBe(50000n);
  });

  it('updates pool total-b after outcome 1 bet', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(poolId), Cl.uint(1), Cl.uint(75000)
    ], wallet2);
    const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-pool-bet-info',
      [Cl.uint(poolId)], deployer);
    const info = (result as any).value;
    expect(info['total-b'].value).toBe(75000n);
  });

  it('records user bet details after placing a bet', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(poolId), Cl.uint(0), Cl.uint(20000)
    ], wallet2);
    const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-user-bet',
      [Cl.uint(poolId), Cl.principal(wallet2)], deployer);
    const bet = (result as any).value.value;
    expect(bet['amount-a'].value).toBe(20000n);
    expect(bet['total-bet'].value).toBe(20000n);
  });

  it('accumulates bets from the same user on the same outcome', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(poolId), Cl.uint(0), Cl.uint(10000)
    ], wallet2);
    simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(poolId), Cl.uint(0), Cl.uint(15000)
    ], wallet2);
    const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-user-bet',
      [Cl.uint(poolId), Cl.principal(wallet2)], deployer);
    const bet = (result as any).value.value;
    expect(bet['amount-a'].value).toBe(25000n);
    expect(bet['total-bet'].value).toBe(25000n);
  });

  it('allows multiple users to bet on the same pool', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(poolId), Cl.uint(0), Cl.uint(10000)
    ], wallet2);
    const { result } = simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(poolId), Cl.uint(1), Cl.uint(10000)
    ], wallet3);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('allows bets on both outcomes from the same user', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(poolId), Cl.uint(0), Cl.uint(10000)
    ], wallet2);
    const { result } = simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(poolId), Cl.uint(1), Cl.uint(10000)
    ], wallet2);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('increments total volume after a bet', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(poolId), Cl.uint(0), Cl.uint(10000)
    ], wallet2);
    const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-total-volume',
      [], deployer);
    expect((result as any).value.value).toBeGreaterThanOrEqual(10000n);
  });

  // ─── Error Cases ──────────────────────────────────────────────────────────

  it('rejects bet on non-existent pool', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(9999), Cl.uint(0), Cl.uint(10000)
    ], wallet2);
    expect(result).toBeErr(Cl.uint(404));
  });

  it('rejects bet with invalid outcome index 2', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(poolId), Cl.uint(2), Cl.uint(10000)
    ], wallet2);
    expect(result).toBeErr(Cl.uint(422));
  });

  it('rejects bet below minimum amount', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(poolId), Cl.uint(0), Cl.uint(100)
    ], wallet2);
    expect(result).toBeErr(Cl.uint(422));
  });

  it('rejects bet on a settled pool', () => {
    // Settle the pool first
    simnet.callPublicFn('predinex-pool', 'settle-pool', [
      Cl.uint(poolId), Cl.uint(0)
    ], wallet1);
    const { result } = simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(poolId), Cl.uint(0), Cl.uint(10000)
    ], wallet2);
    expect(result).toBeErr(Cl.uint(422));
  });

  it('rejects bet when contract is paused', () => {
    simnet.callPublicFn('predinex-pool', 'toggle-pause', [Cl.bool(true)], deployer);
    const { result } = simnet.callPublicFn('predinex-pool', 'place-bet', [
      Cl.uint(poolId), Cl.uint(0), Cl.uint(10000)
    ], wallet2);
    expect(result).toBeErr(Cl.uint(503));
    // Restore state
    simnet.callPublicFn('predinex-pool', 'toggle-pause', [Cl.bool(false)], deployer);
  });
});

// stacks: place-bet edge case — zero outcome index boundary

// stacks: MIN-BET-AMOUNT constant is 10000 microSTX (0.01 STX)

// stacks: pool expiry is set at creation using burn-block-height + duration

// stacks: MAX-BET-TOTAL per user is 1000 STX (1000000000 microSTX)
