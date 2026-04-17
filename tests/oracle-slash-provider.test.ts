import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('predinex-oracle-registry: slash-provider-stake', () => {
  beforeEach(() => {
    simnet.callPublicFn('predinex-oracle-registry',
      'register-oracle-provider-with-stake', [
        Cl.principal(wallet1),
        Cl.uint(1000000000),
        Cl.list([Cl.stringAscii('BTC-USD')]),
        Cl.stringAscii('https://provider.example.com')
      ], deployer);
  });

  it('slashes 10% of provider stake', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'slash-provider-stake', [
        Cl.uint(0),
        Cl.stringAscii('Submitted invalid data')
      ], deployer);
    // 10% of 1000 STX = 100 STX = 100000000 microSTX
    expect(result).toBeOk(Cl.uint(100000000));
  });

  it('reduces provider reputation after slash', () => {
    simnet.callPublicFn('predinex-oracle-registry', 'slash-provider-stake',
      [Cl.uint(0), Cl.stringAscii('Bad data')], deployer);
    const { result } = simnet.callReadOnlyFn('predinex-oracle-registry',
      'get-enhanced-provider-details', [Cl.uint(0)], deployer);
    const provider = (result as any).value.value;
    // Initial reputation is 100, slash reduces by 100 → 0
    expect(provider['reputation-score'].value).toBe(0n);
  });

  it('rejects slash from non-admin', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'slash-provider-stake', [
        Cl.uint(0),
        Cl.stringAscii('Unauthorized slash attempt')
      ], wallet2);
    expect(result).toBeErr(Cl.uint(401));
  });

  it('rejects slash for non-existent provider', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'slash-provider-stake', [
        Cl.uint(999),
        Cl.stringAscii('Non-existent')
      ], deployer);
    expect(result).toBeErr(Cl.uint(430));
  });

  it('updates total staked amount after slash', () => {
    const before = simnet.callReadOnlyFn('predinex-oracle-registry',
      'get-total-staked-amount', [], deployer);
    simnet.callPublicFn('predinex-oracle-registry', 'slash-provider-stake',
      [Cl.uint(0), Cl.stringAscii('Bad data')], deployer);
    const after = simnet.callReadOnlyFn('predinex-oracle-registry',
      'get-total-staked-amount', [], deployer);
    const beforeVal = (before.result as any).value;
    const afterVal = (after.result as any).value;
    expect(afterVal).toBeLessThan(beforeVal);
  });
});
