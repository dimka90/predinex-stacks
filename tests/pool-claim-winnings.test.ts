import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('predinex-pool: claim-winnings', () => {
  beforeEach(() => {
    simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
      [Cl.principal(deployer + '.predinex-pool')], deployer);
    simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Claim Test'), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], deployer);
  });

  it('pays out correct amount after 2% fee', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(100000000)], wallet1);
    simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(0)], deployer);
    const { result } = simnet.callPublicFn('predinex-pool', 'claim-winnings',
      [Cl.uint(1)], wallet1);
    expect(result).toBeOk(Cl.uint(98000000));
  });

  it('distributes proportionally between multiple winners', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(100000000)], wallet1);
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(100000000)], wallet2);
    simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(0)], deployer);
    const { result } = simnet.callPublicFn('predinex-pool', 'claim-winnings',
      [Cl.uint(1)], wallet1);
    // 200 STX total, 2% fee = 196 STX net, wallet1 gets 50% = 98 STX
    expect(result).toBeOk(Cl.uint(98000000));
  });

  it('rejects claim on unsettled pool', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(100000000)], wallet1);
    const { result } = simnet.callPublicFn('predinex-pool', 'claim-winnings',
      [Cl.uint(1)], wallet1);
    expect(result).toBeErr(Cl.uint(412));
  });

  it('rejects double claim', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(100000000)], wallet1);
    simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(0)], deployer);
    simnet.callPublicFn('predinex-pool', 'claim-winnings',
      [Cl.uint(1)], wallet1);
    const { result } = simnet.callPublicFn('predinex-pool', 'claim-winnings',
      [Cl.uint(1)], wallet1);
    expect(result).toBeErr(Cl.uint(410));
  });

  it('rejects claim from loser', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(1), Cl.uint(100000000)], wallet1);
    simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(0)], deployer);
    const { result } = simnet.callPublicFn('predinex-pool', 'claim-winnings',
      [Cl.uint(1)], wallet1);
    expect(result).toBeErr(Cl.uint(411));
  });

  it('rejects claim from user with no bet', () => {
    simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(0)], deployer);
    const { result } = simnet.callPublicFn('predinex-pool', 'claim-winnings',
      [Cl.uint(1)], wallet2);
    expect(result).toBeErr(Cl.uint(411));
  });

  it('marks claim status as true after successful claim', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(100000000)], wallet1);
    simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(0)], deployer);
    simnet.callPublicFn('predinex-pool', 'claim-winnings',
      [Cl.uint(1)], wallet1);
    const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-user-claim-status',
      [Cl.uint(1), Cl.principal(wallet1)], deployer);
    expect(result).toBeOk(Cl.bool(true));
  });
});
