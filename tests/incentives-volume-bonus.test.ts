import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('liquidity-incentives: award-volume-bonus', () => {
  beforeEach(() => {
    simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
      [Cl.principal(deployer + '.predinex-pool')], deployer);
    simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Volume Pool'), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], deployer);
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(100000000)], wallet1);
  });

  it('awards volume bonus when threshold is met', () => {
    const { result } = simnet.callPublicFn('liquidity-incentives',
      'award-volume-bonus', [
        Cl.uint(1),
        Cl.principal(wallet1),
        Cl.uint(1000000)
      ], deployer);
    expect(result).toBeOk(Cl.uint(2000000)); // 2% of 100 STX bet
  });

  it('rejects volume bonus when threshold not met', () => {
    const { result } = simnet.callPublicFn('liquidity-incentives',
      'award-volume-bonus', [
        Cl.uint(1),
        Cl.principal(wallet1),
        Cl.uint(500000) // below 1000000 threshold
      ], deployer);
    expect(result).toBeErr(Cl.uint(400));
  });

  it('rejects duplicate volume bonus for same user and pool', () => {
    simnet.callPublicFn('liquidity-incentives', 'award-volume-bonus', [
      Cl.uint(1), Cl.principal(wallet1), Cl.uint(1000000)
    ], deployer);
    const { result } = simnet.callPublicFn('liquidity-incentives',
      'award-volume-bonus', [
        Cl.uint(1),
        Cl.principal(wallet1),
        Cl.uint(1000000)
      ], deployer);
    expect(result).toBeErr(Cl.uint(410));
  });

  it('rejects volume bonus for non-existent pool', () => {
    const { result } = simnet.callPublicFn('liquidity-incentives',
      'award-volume-bonus', [
        Cl.uint(999),
        Cl.principal(wallet1),
        Cl.uint(1000000)
      ], deployer);
    expect(result).toBeErr(Cl.uint(404));
  });

  it('rejects volume bonus for user with no bet tracking', () => {
    const { result } = simnet.callPublicFn('liquidity-incentives',
      'award-volume-bonus', [
        Cl.uint(1),
        Cl.principal(wallet2),
        Cl.uint(1000000)
      ], deployer);
    expect(result).toBeErr(Cl.uint(404));
  });
});
