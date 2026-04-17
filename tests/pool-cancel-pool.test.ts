import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('predinex-pool: cancel-pool', () => {
  beforeEach(() => {
    simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
      [Cl.principal(deployer + '.predinex-pool')], deployer);
    simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Cancel Test'), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], wallet1);
  });

  it('allows creator to cancel empty pool', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'cancel-pool',
      [Cl.uint(1)], wallet1);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('removes pool from storage after cancellation', () => {
    simnet.callPublicFn('predinex-pool', 'cancel-pool',
      [Cl.uint(1)], wallet1);
    const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-pool-details',
      [Cl.uint(1)], deployer);
    expect((result as any).value).toBeNull();
  });

  it('rejects cancellation from non-creator', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'cancel-pool',
      [Cl.uint(1)], wallet2);
    expect(result).toBeErr(Cl.uint(403));
  });

  it('rejects cancellation of pool with active bets', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(50000000)], wallet2);
    const { result } = simnet.callPublicFn('predinex-pool', 'cancel-pool',
      [Cl.uint(1)], wallet1);
    expect(result).toBeErr(Cl.uint(450));
  });

  it('rejects cancellation of non-existent pool', () => {
    const { result } = simnet.callPublicFn('predinex-pool', 'cancel-pool',
      [Cl.uint(999)], wallet1);
    expect(result).toBeErr(Cl.uint(404));
  });

  it('allows admin to cancel any empty pool', () => {
    simnet.callPublicFn('predinex-pool', 'set-admin',
      [Cl.principal(wallet2), Cl.bool(true)], deployer);
    const { result } = simnet.callPublicFn('predinex-pool', 'cancel-pool',
      [Cl.uint(1)], wallet2);
    expect(result).toBeOk(Cl.bool(true));
  });
});
