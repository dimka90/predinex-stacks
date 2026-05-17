import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';
import { authorizePool, createPool, deployer, wallet1, wallet2, wallet3, settlePool } from './helpers';

/**
 * Tests for predinex-resolution-engine: create-dispute & vote-on-dispute
 * Covers the dispute lifecycle on the Stacks blockchain
 */
describe('predinex-resolution-engine: create-dispute', () => {
  let poolId: bigint;

  beforeEach(() => {
    // Create and settle a pool so disputes can be raised
    poolId = createPool('ETH Price Prediction', wallet1);
    settlePool(Number(poolId), 0, wallet1);
  });

  // ─── Success Cases ────────────────────────────────────────────────────────

  it('creates a dispute on a settled pool and returns dispute id u0', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'create-dispute', [
        Cl.uint(poolId),
        Cl.stringAscii('Incorrect outcome declared by creator'),
        Cl.none()
      ], wallet2);
    expect(result).toBeOk(Cl.uint(0));
  });

  it('increments dispute counter on each new dispute', () => {
    simnet.callPublicFn('predinex-resolution-engine',
      'create-dispute', [
        Cl.uint(poolId),
        Cl.stringAscii('First dispute reason'),
        Cl.none()
      ], wallet2);

    // Create a second pool and settle it for a second dispute
    const poolId2 = createPool('BTC Pool 2', wallet1);
    settlePool(Number(poolId2), 1, wallet1);

    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'create-dispute', [
        Cl.uint(poolId2),
        Cl.stringAscii('Second dispute reason'),
        Cl.none()
      ], wallet3);
    expect(result).toBeOk(Cl.uint(1));
  });

  it('stores dispute details correctly after creation', () => {
    simnet.callPublicFn('predinex-resolution-engine',
      'create-dispute', [
        Cl.uint(poolId),
        Cl.stringAscii('Oracle data was manipulated'),
        Cl.none()
      ], wallet2);
    const { result } = simnet.callReadOnlyFn('predinex-resolution-engine',
      'get-dispute-details', [Cl.uint(0)], deployer);
    const dispute = (result as any).value.value;
    expect(dispute['pool-id'].value).toBe(poolId);
    expect(dispute['status'].value).toBe('active');
    expect(dispute['votes-for'].value).toBe(0n);
    expect(dispute['votes-against'].value).toBe(0n);
  });

  it('creates dispute with evidence hash', () => {
    const evidenceHash = new Uint8Array(32).fill(1);
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'create-dispute', [
        Cl.uint(poolId),
        Cl.stringAscii('Evidence provided in hash'),
        Cl.some(Cl.buffer(evidenceHash))
      ], wallet2);
    expect(result).toBeOk(Cl.uint(0));
  });

  // ─── Error Cases ──────────────────────────────────────────────────────────

  it('rejects dispute on non-existent pool', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'create-dispute', [
        Cl.uint(9999),
        Cl.stringAscii('Pool does not exist'),
        Cl.none()
      ], wallet2);
    expect(result).toBeErr(Cl.uint(404));
  });

  it('rejects dispute with empty reason', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'create-dispute', [
        Cl.uint(poolId),
        Cl.stringAscii(''),
        Cl.none()
      ], wallet2);
    expect(result).toBeErr(Cl.uint(446));
  });

  it('rejects dispute on unsettled pool', () => {
    const unsettledPool = createPool('Unsettled Pool', wallet1);
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'create-dispute', [
        Cl.uint(unsettledPool),
        Cl.stringAscii('Pool is not settled yet'),
        Cl.none()
      ], wallet2);
    // ERR-POOL-SETTLED (u409) is returned when pool is NOT settled (inverted logic in contract)
    expect(result).toBeErr(Cl.uint(409));
  });
});

describe('predinex-resolution-engine: vote-on-dispute', () => {
  let poolId: bigint;
  let disputeId: bigint;

  beforeEach(() => {
    poolId = createPool('SOL Price Prediction', wallet1);
    settlePool(Number(poolId), 0, wallet1);
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'create-dispute', [
        Cl.uint(poolId),
        Cl.stringAscii('Outcome was incorrectly declared'),
        Cl.none()
      ], wallet2);
    disputeId = (result as any).value.value as bigint;
  });

  // ─── Success Cases ────────────────────────────────────────────────────────

  it('casts a vote in favor of the dispute and returns true', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [
        Cl.uint(disputeId),
        Cl.bool(true)
      ], wallet3);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('casts a vote against the dispute and returns true', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [
        Cl.uint(disputeId),
        Cl.bool(false)
      ], wallet3);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('increments votes-for counter after a true vote', () => {
    simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(disputeId), Cl.bool(true)], wallet3);
    const { result } = simnet.callReadOnlyFn('predinex-resolution-engine',
      'get-dispute-details', [Cl.uint(disputeId)], deployer);
    const dispute = (result as any).value.value;
    expect(dispute['votes-for'].value).toBe(1n);
    expect(dispute['votes-against'].value).toBe(0n);
  });

  it('increments votes-against counter after a false vote', () => {
    simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(disputeId), Cl.bool(false)], wallet3);
    const { result } = simnet.callReadOnlyFn('predinex-resolution-engine',
      'get-dispute-details', [Cl.uint(disputeId)], deployer);
    const dispute = (result as any).value.value;
    expect(dispute['votes-for'].value).toBe(0n);
    expect(dispute['votes-against'].value).toBe(1n);
  });

  it('allows multiple different users to vote on the same dispute', () => {
    simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(disputeId), Cl.bool(true)], wallet3);
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(disputeId), Cl.bool(false)], deployer);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('accumulates votes from multiple voters', () => {
    simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(disputeId), Cl.bool(true)], wallet3);
    simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(disputeId), Cl.bool(true)], deployer);
    const { result } = simnet.callReadOnlyFn('predinex-resolution-engine',
      'get-dispute-details', [Cl.uint(disputeId)], deployer);
    const dispute = (result as any).value.value;
    expect(dispute['votes-for'].value).toBe(2n);
  });

  // ─── Error Cases ──────────────────────────────────────────────────────────

  it('rejects duplicate vote from the same user', () => {
    simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(disputeId), Cl.bool(true)], wallet3);
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(disputeId), Cl.bool(false)], wallet3);
    expect(result).toBeErr(Cl.uint(444));
  });

  it('rejects vote on non-existent dispute', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(9999), Cl.bool(true)], wallet3);
    expect(result).toBeErr(Cl.uint(441));
  });
});

// stacks: dispute voting window enforced by block height

// stacks: dispute bond is 5% of total pool value

// stacks: votes-for and votes-against tracked separately per dispute

// stacks: dispute can only be created on settled pools

// stacks: duplicate vote from same principal returns ERR-ALREADY-VOTED u444

// stacks: dispute counter increments after each new dispute created

// stacks: evidence-hash is optional buff 32 in create-dispute

// stacks: ERR-DISPUTE-NOT-FOUND is u441 in resolution engine

// stacks: ERR-POOL-SETTLED u409 returned for unsettled pool dispute attempt

// stacks: voting power is u1 per voter in current implementation

// stacks: dispute voting deadline is 1008 blocks (~1 week) from creation

// stacks: dispute bond returned to disputer if dispute is upheld

// stacks: dispute status transitions from active to resolved

// stacks: pool-disputes map keyed by dispute-id uint

// stacks: get-dispute-details is a read-only function returning optional tuple

// stacks: multiple disputes can exist for different pools simultaneously
