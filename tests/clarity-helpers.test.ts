import { describe, it, expect } from 'vitest';
import { Cl, ClarityType } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("Clarity 3/4 helper functions (predinex-pool)", () => {
  it("get-pool-id-string converts pool ID to ASCII string", () => {
    const poolId = 0;
    simnet.callPublicFn(
      "predinex-pool",
      "create-pool",
      [
        Cl.stringAscii("Pool ID String"),
        Cl.stringAscii("Desc"),
        Cl.stringAscii("A"),
        Cl.stringAscii("B"),
        Cl.uint(100),
      ],
      deployer
    );

    const result = simnet.callReadOnlyFn(
      "predinex-pool",
      "get-pool-id-string",
      [Cl.uint(poolId)],
      deployer
    );

    // int-to-ascii returns a string-ascii type
    // @ts-ignore
    expect(result.result.type).toBe("ascii");
    // @ts-ignore
    expect(result.result.value).toBeDefined();
    // @ts-ignore
    expect(result.result.value).toEqual("0");
  });

  it("get-user-stx-info returns user STX account information", () => {
    const result = simnet.callReadOnlyFn(
      "predinex-pool",
      "get-user-stx-info",
      [Cl.principal(wallet1)],
      deployer
    );

    expect(result.result.type).toBe(ClarityType.Tuple);
    // @ts-ignore
    const accountInfo = result.result.value;
    expect(accountInfo.unlocked).toBeDefined();
    expect(accountInfo.locked).toBeDefined();
    expect(accountInfo.unlocked.type).toBe(ClarityType.UInt);
    expect(accountInfo.locked.type).toBe(ClarityType.UInt);
  });

  it("can-user-afford-bet returns true when user has sufficient balance", () => {
    const result = simnet.callReadOnlyFn(
      "predinex-pool",
      "can-user-afford-bet",
      [Cl.principal(wallet1), Cl.uint(1_000_000)],
      deployer
    );

    expect(result.result.type).toBe(ClarityType.BoolTrue);
  });

  it("can-user-afford-bet returns false when user has insufficient balance", () => {
    // Use an extremely large amount that no wallet would have
    const result = simnet.callReadOnlyFn(
      "predinex-pool",
      "can-user-afford-bet",
      [Cl.principal(wallet1), Cl.uint(1_000_000_000_000_000)],
      deployer
    );

    expect(result.result.type).toBe(ClarityType.BoolFalse);
  });

  it("serialize-pool-totals returns consensus buffer for existing pool", () => {
    const poolId = 0;
    simnet.callPublicFn(
      "predinex-pool",
      "create-pool",
      [
        Cl.stringAscii("Serialize"),
        Cl.stringAscii("Desc"),
        Cl.stringAscii("A"),
        Cl.stringAscii("B"),
        Cl.uint(100),
      ],
      deployer
    );

    simnet.callPublicFn(
      "predinex-pool",
      "place-bet",
      [Cl.uint(poolId), Cl.uint(0), Cl.uint(500_000)],
      wallet1
    );

    const result = simnet.callReadOnlyFn(
      "predinex-pool",
      "serialize-pool-totals",
      [Cl.uint(poolId)],
      deployer
    );

    // Returns optional some with buffer
    expect(result.result.type).toBe(ClarityType.OptionalSome);
    // @ts-ignore
    expect(result.result.value.type).toBe(ClarityType.Buffer);
  });

  it("serialize-pool-totals returns none for non-existent pool", () => {
    const result = simnet.callReadOnlyFn(
      "predinex-pool",
      "serialize-pool-totals",
      [Cl.uint(999)],
      deployer
    );

    expect(result.result.type).toBe(ClarityType.OptionalNone);
  });

  it("validate-principal-and-get-balance returns comprehensive account info", () => {
    const result = simnet.callReadOnlyFn(
      "predinex-pool",
      "validate-principal-and-get-balance",
      [Cl.principal(wallet1)],
      deployer
    );

    expect(result.result.type).toBe(ClarityType.Tuple);
    // @ts-ignore
    const data = result.result.value;
    expect(data.user).toBeDefined();
    expect(data["locked-balance"]).toBeDefined();
    expect(data["unlocked-balance"]).toBeDefined();
    expect(data["total-balance"]).toBeDefined();
    expect(data["can-bet"]).toBeDefined();
    // @ts-ignore
    expect(data.user.value).toEqual(wallet1);
    // @ts-ignore
    expect(data["can-bet"].type).toBe(ClarityType.BoolTrue);
  });

  it("place-bet-safe succeeds when user has sufficient balance", () => {
    const poolId = 0;
    simnet.callPublicFn(
      "predinex-pool",
      "create-pool",
      [
        Cl.stringAscii("Safe Bet"),
        Cl.stringAscii("Desc"),
        Cl.stringAscii("A"),
        Cl.stringAscii("B"),
        Cl.uint(100),
      ],
      deployer
    );

    const bet = simnet.callPublicFn(
      "predinex-pool",
      "place-bet-safe",
      [Cl.uint(poolId), Cl.uint(0), Cl.uint(1_000_000)],
      wallet1
    );

    expect(bet.result).toBeOk(Cl.bool(true));
  });

  it("place-bet-safe fails when user has insufficient balance", () => {
    const poolId = 0;
    simnet.callPublicFn(
      "predinex-pool",
      "create-pool",
      [
        Cl.stringAscii("Safe Bet Fail"),
        Cl.stringAscii("Desc"),
        Cl.stringAscii("A"),
        Cl.stringAscii("B"),
        Cl.uint(100),
      ],
      deployer
    );

    // Use an extremely large amount
    const bet = simnet.callPublicFn(
      "predinex-pool",
      "place-bet-safe",
      [Cl.uint(poolId), Cl.uint(0), Cl.uint(1_000_000_000_000_000)],
      wallet1
    );

    expect(bet.result).toBeErr(Cl.uint(424)); // ERR-INSUFFICIENT-BALANCE
  });
});

