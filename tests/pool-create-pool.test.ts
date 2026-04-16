import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('predinex-pool: create-pool', () => {
  beforeEach(() => {
    simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
      [Cl.principal(deployer + '.predinex-pool')], deployer);
  });

  it('creates a pool and returns pool id u1', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('BTC Price'), Cl.stringAscii('Will BTC hit 100k?'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], wallet1);
    expect(result).toBeOk(Cl.uint(1));
  });

  it('increments pool counter on each creation', () => {
    simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Pool A'), Cl.stringAscii('Desc A'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(500)
    ], wallet1);
    const { result } = simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Pool B'), Cl.stringAscii('Desc B'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(500)
    ], wallet2);
    expect(result).toBeOk(Cl.uint(2));
  });

  it('stores correct creator and title in pool details', () => {
    simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('ETH Pool'), Cl.stringAscii('ETH above 5k?'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], wallet1);
    const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-pool-details',
      [Cl.uint(1)], deployer);
    const pool = (result as any).value.value;
    expect(pool.title.value).toBe('ETH Pool');
    expect(pool.settled.type).toBe('false');
  });

  it('rejects empty title', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii(''), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], wallet1);
    expect(result).toBeErr(Cl.uint(420));
  });

  it('rejects duration below minimum', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Title'), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(0)
    ], wallet1);
    expect(result).toBeErr(Cl.uint(420));
  });

  it('rejects duration above maximum', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Title'), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(99999)
    ], wallet1);
    expect(result).toBeErr(Cl.uint(420));
  });
});
