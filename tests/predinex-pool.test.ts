import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;

describe("predinex-pool contract", () => {
  it("Ensure that create-pool works", () => {
    const title = "Bitcoin vs Ethereum";
    const description = "Will Bitcoin outperform Ethereum?";
    const outcomeA = "Bitcoin";
    const outcomeB = "Ethereum";

    const { result, events } = simnet.callPublicFn(
      "predinex-pool",
      "create-pool",
      [
        Cl.stringAscii(title),
        Cl.stringAscii(description),
        Cl.stringAscii(outcomeA),
        Cl.stringAscii(outcomeB),
        Cl.uint(100) // duration
      ],
      deployer
    );

    // Expecting OK(u0)
    expect(result).toBeOk(Cl.uint(0));
  });

  it("Ensure that place-bet works", () => {
    // 1. Create pool
    simnet.callPublicFn(
      "predinex-pool",
      "create-pool",
      [
        Cl.stringAscii("Pool 2"),
        Cl.stringAscii("Desc"),
        Cl.stringAscii("A"),
        Cl.stringAscii("B"),
        Cl.uint(100)
      ],
      deployer
    );

    // 2. Place bet
    // First argument is pool-id. Should be u0 if simnet resets.
    const { result } = simnet.callPublicFn(
      "predinex-pool",
      "place-bet",
      [
        Cl.uint(0), // pool-id
        Cl.uint(0), // outcome
        Cl.uint(1000000) // amount
      ],
      deployer
    );

    expect(result).toBeOk(Cl.bool(true));
  });

  it("Ensure that settle-pool works", () => {
    simnet.callPublicFn(
      "predinex-pool",
      "create-pool",
      [
        Cl.stringAscii("Pool 3"),
        Cl.stringAscii("Desc"),
        Cl.stringAscii("A"),
        Cl.stringAscii("B"),
        Cl.uint(100)
      ],
      deployer
    );

    const { result } = simnet.callPublicFn(
      "predinex-pool",
      "settle-pool",
      [
        Cl.uint(0),
        Cl.uint(0)
      ],
      deployer
    );

    expect(result).toBeOk(Cl.bool(true));
  });
});
