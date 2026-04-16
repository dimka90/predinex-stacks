import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('predinex-oracle-registry: deactivate-oracle-provider / reactivate-oracle-provider', () => {
  beforeEach(() => {
    simnet.callPublicFn('predinex-oracle-registry',
      'register-oracle-provider-with-stake', [
        Cl.principal(wallet1),
        Cl.uint(1000000000),
        Cl.list([Cl.stringAscii('BTC-USD')]),
        Cl.stringAscii('https://provider.example.com')
      ], deployer);
  });

  it('deactivates an active provider', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'deactivate-oracle-provider', [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('provider is inactive after deactivation', () => {
    simnet.callPublicFn('predinex-oracle-registry',
      'deactivate-oracle-provider', [Cl.uint(0)], deployer);
    const { result } = simnet.callReadOnlyFn('predinex-oracle-registry',
      'get-provider-details', [Cl.uint(0)], deployer);
    const provider = (result as any).value.value;
    expect(provider['is-active'].type).toBe('false');
  });

  it('reactivates a deactivated provider', () => {
    simnet.callPublicFn('predinex-oracle-registry',
      'deactivate-oracle-provider', [Cl.uint(0)], deployer);
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'reactivate-oracle-provider', [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('provider is active after reactivation', () => {
    simnet.callPublicFn('predinex-oracle-registry',
      'deactivate-oracle-provider', [Cl.uint(0)], deployer);
    simnet.callPublicFn('predinex-oracle-registry',
      'reactivate-oracle-provider', [Cl.uint(0)], deployer);
    const { result } = simnet.callReadOnlyFn('predinex-oracle-registry',
      'get-provider-details', [Cl.uint(0)], deployer);
    const provider = (result as any).value.value;
    expect(provider['is-active'].type).toBe('true');
  });

  it('rejects deactivation from non-admin', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'deactivate-oracle-provider', [Cl.uint(0)], wallet2);
    expect(result).toBeErr(Cl.uint(401));
  });

  it('rejects deactivation of non-existent provider', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'deactivate-oracle-provider', [Cl.uint(999)], deployer);
    expect(result).toBeErr(Cl.uint(430));
  });
});
