import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('predinex-oracle-registry: register-oracle-provider-with-stake', () => {
  it('registers a new oracle provider and returns provider id', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'register-oracle-provider-with-stake', [
        Cl.principal(wallet1),
        Cl.uint(1000000000),
        Cl.list([Cl.stringAscii('BTC-USD')]),
        Cl.stringAscii('https://provider.example.com')
      ], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it('stores provider details after registration', () => {
    simnet.callPublicFn('predinex-oracle-registry',
      'register-oracle-provider-with-stake', [
        Cl.principal(wallet1),
        Cl.uint(1000000000),
        Cl.list([Cl.stringAscii('BTC-USD')]),
        Cl.stringAscii('https://provider.example.com')
      ], deployer);
    const { result } = simnet.callReadOnlyFn('predinex-oracle-registry',
      'get-provider-details', [Cl.uint(0)], deployer);
    const provider = (result as any).value.value;
    expect(provider['is-active'].type).toBe('true');
  });

  it('rejects registration with insufficient stake', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'register-oracle-provider-with-stake', [
        Cl.principal(wallet1),
        Cl.uint(100),
        Cl.list([Cl.stringAscii('BTC-USD')]),
        Cl.stringAscii('https://provider.example.com')
      ], deployer);
    expect(result).toBeErr(Cl.uint(450));
  });

  it('rejects duplicate provider registration', () => {
    simnet.callPublicFn('predinex-oracle-registry',
      'register-oracle-provider-with-stake', [
        Cl.principal(wallet1),
        Cl.uint(1000000000),
        Cl.list([Cl.stringAscii('BTC-USD')]),
        Cl.stringAscii('https://provider.example.com')
      ], deployer);
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'register-oracle-provider-with-stake', [
        Cl.principal(wallet1),
        Cl.uint(1000000000),
        Cl.list([Cl.stringAscii('ETH-USD')]),
        Cl.stringAscii('https://provider2.example.com')
      ], deployer);
    expect(result).toBeErr(Cl.uint(433));
  });

  it('rejects registration from non-admin', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'register-oracle-provider-with-stake', [
        Cl.principal(wallet2),
        Cl.uint(1000000000),
        Cl.list([Cl.stringAscii('BTC-USD')]),
        Cl.stringAscii('https://provider.example.com')
      ], wallet1);
    expect(result).toBeErr(Cl.uint(401));
  });

  it('maps provider address to id after registration', () => {
    simnet.callPublicFn('predinex-oracle-registry',
      'register-oracle-provider-with-stake', [
        Cl.principal(wallet1),
        Cl.uint(1000000000),
        Cl.list([Cl.stringAscii('BTC-USD')]),
        Cl.stringAscii('https://provider.example.com')
      ], deployer);
    const { result } = simnet.callReadOnlyFn('predinex-oracle-registry',
      'get-provider-id-by-address', [Cl.principal(wallet1)], deployer);
    expect((result as any).value.value).toBe(0n);
  });
});
