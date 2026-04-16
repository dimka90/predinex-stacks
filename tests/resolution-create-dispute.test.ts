import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('predinex-resolution-engine: create-dispute', () => {
  beforeEach(() => {
    simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
      [Cl.principal(deployer + '.predinex-pool')], deployer);
    simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Dispute Test'), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], deployer);
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(100000000)], wallet1);
    simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(1)], deployer);
  });

  it('creates a dispute on a settled pool', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'create-dispute', [
        Cl.uint(1),
        Cl.stringAscii('The resolution was incorrect based on oracle data'),
        Cl.none()
      ], wallet1);
    expect(result).toBeOk(Cl.uint(0));
  });

  it('rejects dispute on unsettled pool', () => {
    simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Unsettled'), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], deployer);
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'create-dispute', [
        Cl.uint(2),
        Cl.stringAscii('Dispute reason'),
        Cl.none()
      ], wallet1);
    expect(result).toBeErr(Cl.uint(409));
  });

  it('rejects dispute with empty reason', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'create-dispute', [
        Cl.uint(1),
        Cl.stringAscii(''),
        Cl.none()
      ], wallet1);
    expect(result).toBeErr(Cl.uint(446));
  });

  it('rejects dispute on non-existent pool', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'create-dispute', [
        Cl.uint(999),
        Cl.stringAscii('Dispute reason'),
        Cl.none()
      ], wallet1);
    expect(result).toBeErr(Cl.uint(404));
  });

  it('stores dispute details correctly', () => {
    simnet.callPublicFn('predinex-resolution-engine', 'create-dispute', [
      Cl.uint(1),
      Cl.stringAscii('The resolution was incorrect'),
      Cl.none()
    ], wallet1);
    const { result } = simnet.callReadOnlyFn('predinex-resolution-engine',
      'get-dispute-details', [Cl.uint(0)], deployer);
    const dispute = (result as any).value.value;
    expect(dispute['pool-id'].value).toBe(1n);
    expect(dispute.status.value).toBe('active');
  });
});
