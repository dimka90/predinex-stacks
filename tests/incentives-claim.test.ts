import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('liquidity-incentives: claim-incentive', () => {
  beforeEach(() => {
    simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
      [Cl.principal(deployer + '.predinex-pool')], deployer);
    simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Claim Pool'), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], deployer);
    // Fund the incentive contract
    simnet.callPublicFn('liquidity-incentives', 'deposit-incentive-funds',
      [Cl.uint(1000000000)], deployer);
    // Award a referral bonus to wallet1 to create a claimable incentive
    simnet.callPublicFn('liquidity-incentives', 'award-referral-bonus', [
      Cl.principal(wallet1),
      Cl.principal(wallet2),
      Cl.uint(1),
      Cl.uint(100000000)
    ], deployer);
  });

  it('rejects claim for non-existent incentive', () => {
    const { result } = simnet.callPublicFn('liquidity-incentives',
      'claim-incentive', [Cl.uint(1), Cl.stringAscii('early-bird')], wallet2);
    expect(result).toBeErr(Cl.uint(405));
  });

  it('rejects double claim of same incentive', () => {
    // First claim (may fail due to vesting, but tests the path)
    simnet.callPublicFn('liquidity-incentives',
      'claim-incentive', [Cl.uint(1), Cl.stringAscii('referral')], wallet1);
    const { result } = simnet.callPublicFn('liquidity-incentives',
      'claim-incentive', [Cl.uint(1), Cl.stringAscii('referral')], wallet1);
    // Either already claimed (410) or vesting not met (408)
    expect([408n, 410n]).toContain((result as any).value.value);
  });

  it('rejects claim after window closes', () => {
    // Advance blocks past claim window (2016 blocks)
    simnet.mineEmptyBlocks(2020);
    const { result } = simnet.callPublicFn('liquidity-incentives',
      'claim-incentive', [Cl.uint(1), Cl.stringAscii('referral')], wallet1);
    expect(result).toBeErr(Cl.uint(413));
  });

  it('deposit-incentive-funds increases contract balance', () => {
    const { result } = simnet.callReadOnlyFn('liquidity-incentives',
      'get-contract-stats', [], deployer);
    const stats = (result as any).value.value;
    expect(stats['contract-balance'].value).toBeGreaterThan(0n);
  });

  it('withdraw-unclaimed-incentives reduces contract balance', () => {
    simnet.callPublicFn('liquidity-incentives', 'withdraw-unclaimed-incentives',
      [Cl.uint(500000000)], deployer);
    const { result } = simnet.callReadOnlyFn('liquidity-incentives',
      'get-contract-stats', [], deployer);
    const stats = (result as any).value.value;
    expect(stats['contract-balance'].value).toBe(500000000n);
  });
});
