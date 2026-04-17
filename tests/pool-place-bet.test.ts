import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('predinex-pool: place-bet', () => {
  beforeEach(() => {
    simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
      [Cl.principal(deployer + '.predinex-pool')], deployer);
    simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Test Pool'), Cl.stringAscii('Test Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], deployer);
  });

  it('places a bet on outcome 0 successfully', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(50000000)], wallet1);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('places a bet on outcome 1 successfully', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(1), Cl.uint(50000000)], wallet1);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('updates pool totals after bet', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(50000000)], wallet1);
    const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-pool-bet-info',
      [Cl.uint(1)], deployer);
    const info = (result as any).value.value;
    expect(info['total-a'].value).toBe(50000000n);
  });

  it('rejects bet below minimum amount', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(100)], wallet1);
    expect(result).toBeErr(Cl.uint(422));
  });

  it('rejects bet on invalid outcome index', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(5), Cl.uint(50000000)], wallet1);
    expect(result).toBeErr(Cl.uint(422));
  });

  it('rejects bet on non-existent pool', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(999), Cl.uint(0), Cl.uint(50000000)], wallet1);
    expect(result).toBeErr(Cl.uint(404));
  });

  it('rejects bet on settled pool', () => {
    simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(0)], deployer);
    const { result } = simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(50000000)], wallet1);
    expect(result).toBeErr(Cl.uint(422));
  });

  it('accumulates bets from multiple users', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(50000000)], wallet1);
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(1), Cl.uint(30000000)], wallet2);
    const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-pool-bet-info',
      [Cl.uint(1)], deployer);
    const info = (result as any).value.value;
    expect(info['total-volume'].value).toBe(80000000n);
  });
});
