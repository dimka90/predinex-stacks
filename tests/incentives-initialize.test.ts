import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;

describe('liquidity-incentives: initialize-pool-incentives', () => {
  beforeEach(() => {
    simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
      [Cl.principal(deployer + '.predinex-pool')], deployer);
  });

  it('initializes incentives for a pool via authorized contract', () => {
    // Pool creation triggers initialize-pool-incentives internally
    const { result } = simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Incentive Pool'), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], deployer);
    expect(result).toBeOk(Cl.uint(1));
  });

  it('rejects initialization from unauthorized caller', () => {
    const { result } = simnet.callPublicFn('liquidity-incentives',
      'initialize-pool-incentives', [Cl.uint(1)], wallet1);
    expect(result).toBeErr(Cl.uint(401));
  });

  it('rejects initialization with pool id 0', () => {
    // Set wallet1 as authorized to test the pool-id validation
    simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
      [Cl.principal(wallet1)], deployer);
    const { result } = simnet.callPublicFn('liquidity-incentives',
      'initialize-pool-incentives', [Cl.uint(0)], wallet1);
    expect(result).toBeErr(Cl.uint(400));
  });

  it('contract stats reflect new pool after initialization', () => {
    simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Stats Pool'), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], deployer);
    const { result } = simnet.callReadOnlyFn('liquidity-incentives',
      'get-contract-stats', [], deployer);
    const stats = (result as any).value.value;
    expect(stats['active-pools'].value).toBe(1n);
  });

  it('paused contract rejects initialization', () => {
    simnet.callPublicFn('liquidity-incentives', 'pause-contract', [], deployer);
    const { result } = simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Paused Pool'), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], deployer);
    expect(result).toBeErr(Cl.uint(500));
  });
});
