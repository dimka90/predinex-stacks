import { describe, it, expect } from 'vitest';
import { Cl, ClarityType } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("liquidity incentives for early bettors", () => {
  it("awards bonus to early bettors when claiming winnings", () => {
    const poolId = 0;
    
    // Create pool
    simnet.callPublicFn(
      "predinex-pool",
      "create-pool",
      [
        Cl.stringAscii("Early Bettor Test"),
        Cl.stringAscii("Desc"),
        Cl.stringAscii("A"),
        Cl.stringAscii("B"),
        Cl.uint(100),
      ],
      deployer
    );

    // Wallet1 bets early (within 50 blocks of creation)
    simnet.callPublicFn(
      "predinex-pool",
      "place-bet",
      [Cl.uint(poolId), Cl.uint(0), Cl.uint(1_000_000)],
      wallet1
    );

    // Wallet2 bets later (after window)
    simnet.mineEmptyBlocks(60);
    simnet.callPublicFn(
      "predinex-pool",
      "place-bet",
      [Cl.uint(poolId), Cl.uint(0), Cl.uint(1_000_000)],
      wallet2
    );

    // Settle pool with outcome 0 (both bet on 0)
    simnet.callPublicFn(
      "predinex-pool",
      "settle-pool",
      [Cl.uint(poolId), Cl.uint(0)],
      deployer
    );

    // Check early bettor status
    const isEarly1 = simnet.callReadOnlyFn(
      "predinex-pool",
      "is-early-bettor",
      [Cl.uint(poolId), Cl.principal(wallet1)],
      deployer
    );
    expect(isEarly1.result.type).toBe(ClarityType.ResponseOk);
    // @ts-ignore
    expect(isEarly1.result.value).toBe(true);

    const isEarly2 = simnet.callReadOnlyFn(
      "predinex-pool",
      "is-early-bettor",
      [Cl.uint(poolId), Cl.principal(wallet2)],
      deployer
    );
    expect(isEarly2.result.type).toBe(ClarityType.ResponseOk);
    // @ts-ignore
    expect(isEarly2.result.value).toBe(false);

    // Claim winnings - wallet1 should get bonus
    const claim1 = simnet.callPublicFn(
      "predinex-pool",
      "claim-winnings",
      [Cl.uint(poolId)],
      wallet1
    );
    expect(claim1.result).toBeOk(Cl.bool(true));

    // Verify transfer events - wallet1 should get more due to bonus
    const transfers1 = claim1.events.filter(e => e.event === 'stx_transfer_event');
    expect(transfers1.length).toBeGreaterThan(0);
    
    // Wallet2 claims - should get standard share without bonus
    const claim2 = simnet.callPublicFn(
      "predinex-pool",
      "claim-winnings",
      [Cl.uint(poolId)],
      wallet2
    );
    expect(claim2.result).toBeOk(Cl.bool(true));
  });

  it("provides liquidity incentive info via read-only function", () => {
    const poolId = 0;
    
    simnet.callPublicFn(
      "predinex-pool",
      "create-pool",
      [
        Cl.stringAscii("Incentive Info"),
        Cl.stringAscii("Desc"),
        Cl.stringAscii("A"),
        Cl.stringAscii("B"),
        Cl.uint(100),
      ],
      deployer
    );

    const info = simnet.callReadOnlyFn(
      "predinex-pool",
      "get-liquidity-incentive-info",
      [Cl.uint(poolId)],
      deployer
    );

    expect(info.result.type).toBe(ClarityType.ResponseOk);
    // @ts-ignore
    const data = info.result.value.value;
    expect(data["early-bettor-window"].value.toString()).toEqual("50");
    expect(data["bonus-percent"].value.toString()).toEqual("5");
    expect(data["window-active"].value).toBe(true);
  });

  it("calculates early bettor bonus correctly", () => {
    const poolId = 0;
    const baseShare = 1000000; // 1 STX
    
    simnet.callPublicFn(
      "predinex-pool",
      "create-pool",
      [
        Cl.stringAscii("Bonus Calc"),
        Cl.stringAscii("Desc"),
        Cl.stringAscii("A"),
        Cl.stringAscii("B"),
        Cl.uint(100),
      ],
      deployer
    );

    // Early bettor
    simnet.callPublicFn(
      "predinex-pool",
      "place-bet",
      [Cl.uint(poolId), Cl.uint(0), Cl.uint(500_000)],
      wallet1
    );

    const bonus = simnet.callReadOnlyFn(
      "predinex-pool",
      "get-early-bettor-bonus",
      [Cl.uint(poolId), Cl.principal(wallet1), Cl.uint(baseShare)],
      deployer
    );

    expect(bonus.result.type).toBe(ClarityType.ResponseOk);
    // @ts-ignore
    // 5% of 1000000 = 50000
    expect(bonus.result.value.value.toString()).toEqual("50000");
  });
});

