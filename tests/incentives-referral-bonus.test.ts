import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('liquidity-incentives: award-referral-bonus', () => {
  beforeEach(() => {
    simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
      [Cl.principal(deployer + '.predinex-pool')], deployer);
    simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Referral Pool'), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], deployer);
  });

  it('awards referral bonus to referrer', () => {
    const { result } = simnet.callPublicFn('liquidity-incentives',
      'award-referral-bonus', [
        Cl.principal(wallet1),
        Cl.principal(wallet2),
        Cl.uint(1),
        Cl.uint(100000000)
      ], deployer);
    // 2% of 100 STX = 2 STX = 2000000 microSTX
    expect(result).toBeOk(Cl.uint(2000000));
  });

  it('rejects self-referral', () => {
    const { result } = simnet.callPublicFn('liquidity-incentives',
      'award-referral-bonus', [
        Cl.principal(wallet1),
        Cl.principal(wallet1),
        Cl.uint(1),
        Cl.uint(100000000)
      ], deployer);
    expect(result).toBeErr(Cl.uint(400));
  });

  it('rejects referral with zero bet amount', () => {
    const { result } = simnet.callPublicFn('liquidity-incentives',
      'award-referral-bonus', [
        Cl.principal(wallet1),
        Cl.principal(wallet2),
        Cl.uint(1),
        Cl.uint(0)
      ], deployer);
    expect(result).toBeErr(Cl.uint(400));
  });

  it('rejects referral for non-existent pool', () => {
    const { result } = simnet.callPublicFn('liquidity-incentives',
      'award-referral-bonus', [
        Cl.principal(wallet1),
        Cl.principal(wallet2),
        Cl.uint(999),
        Cl.uint(100000000)
      ], deployer);
    expect(result).toBeErr(Cl.uint(404));
  });

  it('stores referral tracking record', () => {
    simnet.callPublicFn('liquidity-incentives', 'award-referral-bonus', [
      Cl.principal(wallet1),
      Cl.principal(wallet2),
      Cl.uint(1),
      Cl.uint(100000000)
    ], deployer);
    // Verify via user incentive totals
    const { result } = simnet.callReadOnlyFn('liquidity-incentives',
      'get-user-incentive-totals', [Cl.principal(wallet1)], deployer);
    expect(result).toBeOk(expect.anything());
  });
});
