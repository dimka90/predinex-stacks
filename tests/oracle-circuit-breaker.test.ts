import { Cl } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;

describe('predinex-oracle-registry: trigger-circuit-breaker / deactivate-circuit-breaker', () => {
  it('activates circuit breaker successfully', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'trigger-circuit-breaker', [
        Cl.stringAscii('Emergency halt'),
        Cl.uint(100)
      ], deployer);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('circuit breaker is active after trigger', () => {
    simnet.callPublicFn('predinex-oracle-registry', 'trigger-circuit-breaker',
      [Cl.stringAscii('Emergency'), Cl.uint(100)], deployer);
    const { result } = simnet.callReadOnlyFn('predinex-oracle-registry',
      'is-circuit-breaker-active', [], deployer);
    expect(result).toBe(Cl.bool(true));
  });

  it('deactivates circuit breaker successfully', () => {
    simnet.callPublicFn('predinex-oracle-registry', 'trigger-circuit-breaker',
      [Cl.stringAscii('Emergency'), Cl.uint(100)], deployer);
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'deactivate-circuit-breaker', [], deployer);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('circuit breaker is inactive after deactivation', () => {
    simnet.callPublicFn('predinex-oracle-registry', 'trigger-circuit-breaker',
      [Cl.stringAscii('Emergency'), Cl.uint(100)], deployer);
    simnet.callPublicFn('predinex-oracle-registry', 'deactivate-circuit-breaker', [], deployer);
    const { result } = simnet.callReadOnlyFn('predinex-oracle-registry',
      'is-circuit-breaker-active', [], deployer);
    expect(result).toBe(Cl.bool(false));
  });

  it('rejects circuit breaker trigger from non-admin', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'trigger-circuit-breaker', [
        Cl.stringAscii('Unauthorized'),
        Cl.uint(100)
      ], wallet1);
    expect(result).toBeErr(Cl.uint(401));
  });
});
