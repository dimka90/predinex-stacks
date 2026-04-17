import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('predinex-pool: settle-pool', () => {
  beforeEach(() => {
    simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
      [Cl.principal(deployer + '.predinex-pool')], deployer);
    simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Settle Test'), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], deployer);
  });

  it('allows creator to settle with outcome 0', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('allows creator to settle with outcome 1', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(1)], deployer);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('marks pool as settled after settlement', () => {
    simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(0)], deployer);
    const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-pool-details',
      [Cl.uint(1)], deployer);
    const pool = (result as any).value.value;
    expect(pool.settled.type).toBe('true');
  });

  it('rejects settlement from unauthorized user', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(0)], wallet1);
    expect(result).toBeErr(Cl.uint(401));
  });

  it('rejects double settlement', () => {
    simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(0)], deployer);
    const { result } = simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(1)], deployer);
    expect(result).toBeErr(Cl.uint(409));
  });

  it('rejects invalid outcome index', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(2)], deployer);
    expect(result).toBeErr(Cl.uint(422));
  });

  it('rejects settlement of non-existent pool', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(999), Cl.uint(0)], deployer);
    expect(result).toBeErr(Cl.uint(404));
  });

  it('allows authorized resolution engine to settle', () => {
    simnet.callPublicFn('predinex-pool', 'set-authorized-resolution-engine',
      [Cl.principal(wallet2)], deployer);
    const { result } = simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(0)], wallet2);
    expect(result).toBeOk(Cl.bool(true));
  });
});
