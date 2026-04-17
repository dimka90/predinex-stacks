import { Cl } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;

describe('metric-booster: toggle-pause', () => {
  it('allows owner to pause the contract', () => {
    const { result } = simnet.callPublicFn('metric-booster', 'toggle-pause',
      [Cl.bool(true)], deployer);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('allows owner to unpause the contract', () => {
    simnet.callPublicFn('metric-booster', 'toggle-pause', [Cl.bool(true)], deployer);
    const { result } = simnet.callPublicFn('metric-booster', 'toggle-pause',
      [Cl.bool(false)], deployer);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('rejects pause from non-owner', () => {
    const { result } = simnet.callPublicFn('metric-booster', 'toggle-pause',
      [Cl.bool(true)], wallet1);
    expect(result).toBeErr(Cl.uint(502));
  });

  it('blocks pulse after pause', () => {
    simnet.callPublicFn('metric-booster', 'toggle-pause', [Cl.bool(true)], deployer);
    const { result } = simnet.callPublicFn('metric-booster', 'pulse', [], wallet1);
    expect(result).toBeErr(Cl.uint(502));
  });

  it('blocks pulse-n after pause', () => {
    simnet.callPublicFn('metric-booster', 'toggle-pause', [Cl.bool(true)], deployer);
    const { result } = simnet.callPublicFn('metric-booster', 'pulse-n', [Cl.uint(5)], wallet1);
    expect(result).toBeErr(Cl.uint(502));
  });

  it('counter does not change while paused', () => {
    simnet.callPublicFn('metric-booster', 'pulse', [], wallet1);
    simnet.callPublicFn('metric-booster', 'toggle-pause', [Cl.bool(true)], deployer);
    simnet.callPublicFn('metric-booster', 'pulse', [], wallet1); // should fail silently
    const { result } = simnet.callReadOnlyFn('metric-booster', 'get-counter', [], deployer);
    expect(result).toBeOk(Cl.uint(1));
  });
});
