import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('predinex-resolution-engine: configure-pool-resolution', () => {
  beforeEach(() => {
    simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
      [Cl.principal(deployer + '.predinex-pool')], deployer);
    // Register oracle provider
    simnet.callPublicFn('predinex-oracle-registry',
      'register-oracle-provider-with-stake', [
        Cl.principal(wallet2),
        Cl.uint(1000000000),
        Cl.list([Cl.stringAscii('BTC-USD')]),
        Cl.stringAscii('https://provider.example.com')
      ], deployer);
    // Create pool
    simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Resolution Test'), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], wallet1);
  });

  it('configures resolution for a pool successfully', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'configure-pool-resolution', [
        Cl.uint(1),
        Cl.list([Cl.uint(0)]),
        Cl.stringAscii('BTC price above 100k at expiry'),
        Cl.stringAscii('PRICE'),
        Cl.none(),
        Cl.stringAscii('AND'),
        Cl.uint(3)
      ], wallet1);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('rejects duplicate configuration for same pool', () => {
    simnet.callPublicFn('predinex-resolution-engine',
      'configure-pool-resolution', [
        Cl.uint(1),
        Cl.list([Cl.uint(0)]),
        Cl.stringAscii('BTC price above 100k at expiry'),
        Cl.stringAscii('PRICE'),
        Cl.none(),
        Cl.stringAscii('AND'),
        Cl.uint(3)
      ], wallet1);
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'configure-pool-resolution', [
        Cl.uint(1),
        Cl.list([Cl.uint(0)]),
        Cl.stringAscii('BTC price above 100k at expiry'),
        Cl.stringAscii('PRICE'),
        Cl.none(),
        Cl.stringAscii('AND'),
        Cl.uint(3)
      ], wallet1);
    expect(result).toBeErr(Cl.uint(439));
  });

  it('rejects configuration from non-creator', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'configure-pool-resolution', [
        Cl.uint(1),
        Cl.list([Cl.uint(0)]),
        Cl.stringAscii('BTC price above 100k at expiry'),
        Cl.stringAscii('PRICE'),
        Cl.none(),
        Cl.stringAscii('AND'),
        Cl.uint(3)
      ], wallet2);
    expect(result).toBeErr(Cl.uint(401));
  });

  it('rejects configuration with invalid logical operator', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'configure-pool-resolution', [
        Cl.uint(1),
        Cl.list([Cl.uint(0)]),
        Cl.stringAscii('BTC price above 100k at expiry'),
        Cl.stringAscii('PRICE'),
        Cl.none(),
        Cl.stringAscii('XOR'),
        Cl.uint(3)
      ], wallet1);
    expect(result).toBeErr(Cl.uint(437));
  });

  it('rejects configuration for non-existent pool', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'configure-pool-resolution', [
        Cl.uint(999),
        Cl.list([Cl.uint(0)]),
        Cl.stringAscii('BTC price above 100k at expiry'),
        Cl.stringAscii('PRICE'),
        Cl.none(),
        Cl.stringAscii('AND'),
        Cl.uint(3)
      ], wallet1);
    expect(result).toBeErr(Cl.uint(404));
  });
});
