import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;

describe('metric-booster: pulse', () => {
  it('increments counter by 1', () => {
    simnet.callPublicFn('metric-booster', 'pulse', [], wallet1);
    const { result } = simnet.callReadOnlyFn('metric-booster', 'get-counter', [], deployer);
    expect(result).toBeOk(Cl.uint(1));
  });

  it('accumulates multiple pulses', () => {
    simnet.callPublicFn('metric-booster', 'pulse', [], wallet1);
    simnet.callPublicFn('metric-booster', 'pulse', [], wallet1);
    simnet.callPublicFn('metric-booster', 'pulse', [], wallet1);
    const { result } = simnet.callReadOnlyFn('metric-booster', 'get-counter', [], deployer);
    expect(result).toBeOk(Cl.uint(3));
  });

  it('returns true on success', () => {
    const { result } = simnet.callPublicFn('metric-booster', 'pulse', [], wallet1);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('rejects pulse when paused', () => {
    simnet.callPublicFn('metric-booster', 'toggle-pause', [Cl.bool(true)], deployer);
    const { result } = simnet.callPublicFn('metric-booster', 'pulse', [], wallet1);
    expect(result).toBeErr(Cl.uint(502));
  });

  it('allows pulse after unpausing', () => {
    simnet.callPublicFn('metric-booster', 'toggle-pause', [Cl.bool(true)], deployer);
    simnet.callPublicFn('metric-booster', 'toggle-pause', [Cl.bool(false)], deployer);
    const { result } = simnet.callPublicFn('metric-booster', 'pulse', [], wallet1);
    expect(result).toBeOk(Cl.bool(true));
  });
});
