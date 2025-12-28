import { describe, it, expect } from 'vitest';
import { Cl, ClarityType } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("advanced market features", () => {
  describe("multiple outcomes support", () => {
    it("creates pool with multiple outcomes", () => {
      const outcomeNames = Cl.list([
        Cl.stringAscii("Option A"),
        Cl.stringAscii("Option B"),
        Cl.stringAscii("Option C"),
        Cl.stringAscii("Option D")
      ]);

      const result = simnet.callPublicFn(
        "predinex-pool",
        "create-pool-multi-outcome",
        [
          Cl.stringAscii("Multi Outcome Pool"),
          Cl.stringAscii("Test multiple outcomes"),
          outcomeNames,
          Cl.uint(100),
          Cl.uint(50)
        ],
        deployer
      );

      expect(result.result).toBeOk(Cl.uint(0));
    });

    it("allows betting on multiple outcomes", () => {
      const outcomeNames = Cl.list([
        Cl.stringAscii("A"),
        Cl.stringAscii("B"),
        Cl.stringAscii("C")
      ]);

      simnet.callPublicFn(
        "predinex-pool",
        "create-pool-multi-outcome",
        [
          Cl.stringAscii("Multi Bet"),
          Cl.stringAscii("Desc"),
          outcomeNames,
          Cl.uint(100),
          Cl.uint(50)
        ],
        deployer
      );

      // Bet on outcome 0
      const bet0 = simnet.callPublicFn(
        "predinex-pool",
        "place-bet-multi-outcome",
        [Cl.uint(0), Cl.uint(0), Cl.uint(1_000_000)],
        wallet1
      );
      expect(bet0.result).toBeOk(Cl.bool(true));

      // Bet on outcome 2 (third outcome)
      const bet2 = simnet.callPublicFn(
        "predinex-pool",
        "place-bet-multi-outcome",
        [Cl.uint(0), Cl.uint(2), Cl.uint(500_000)],
        wallet2
      );
      expect(bet2.result).toBeOk(Cl.bool(true));
    });
  });

  describe("oracle integration", () => {
    it("allows oracle-based settlement by owner", () => {
      simnet.callPublicFn(
        "predinex-pool",
        "create-pool",
        [
          Cl.stringAscii("Oracle Pool"),
          Cl.stringAscii("Desc"),
          Cl.stringAscii("A"),
          Cl.stringAscii("B"),
          Cl.uint(100)
        ],
        deployer
      );

      simnet.callPublicFn(
        "predinex-pool",
        "place-bet",
        [Cl.uint(0), Cl.uint(0), Cl.uint(1_000_000)],
        wallet1
      );

      // Oracle settlement (mock signature)
      const oracleSig = Cl.bufferFromHex("00".repeat(65));
      const settle = simnet.callPublicFn(
        "predinex-pool",
        "settle-pool-oracle",
        [Cl.uint(0), Cl.uint(0), oracleSig],
        deployer
      );

      expect(settle.result).toBeOk(Cl.bool(true));
    });
  });

  describe("dispute resolution", () => {
    it("allows challenging a settlement within dispute period", () => {
      simnet.callPublicFn(
        "predinex-pool",
        "create-pool",
        [
          Cl.stringAscii("Dispute Pool"),
          Cl.stringAscii("Desc"),
          Cl.stringAscii("A"),
          Cl.stringAscii("B"),
          Cl.uint(100)
        ],
        deployer
      );

      simnet.callPublicFn(
        "predinex-pool",
        "place-bet",
        [Cl.uint(0), Cl.uint(0), Cl.uint(1_000_000)],
        wallet1
      );

      simnet.callPublicFn(
        "predinex-pool",
        "settle-pool",
        [Cl.uint(0), Cl.uint(0)],
        deployer
      );

      // Challenge settlement
      const challenge = simnet.callPublicFn(
        "predinex-pool",
        "challenge-settlement",
        [Cl.uint(0), Cl.stringAscii("Settlement is incorrect")],
        wallet1
      );

      expect(challenge.result).toBeOk(Cl.uint(0));
    });

    it("prevents challenging after dispute period expires", () => {
      simnet.callPublicFn(
        "predinex-pool",
        "create-pool",
        [
          Cl.stringAscii("Expired Dispute"),
          Cl.stringAscii("Desc"),
          Cl.stringAscii("A"),
          Cl.stringAscii("B"),
          Cl.uint(100)
        ],
        deployer
      );

      simnet.callPublicFn(
        "predinex-pool",
        "settle-pool",
        [Cl.uint(0), Cl.uint(0)],
        deployer
      );

      // Advance past dispute period (default 100 blocks)
      simnet.mineEmptyBlocks(110);

      const challenge = simnet.callPublicFn(
        "predinex-pool",
        "challenge-settlement",
        [Cl.uint(0), Cl.stringAscii("Too late")],
        wallet1
      );

      expect(challenge.result).toBeErr(Cl.uint(431)); // ERR-DISPUTE-PERIOD-EXPIRED
    });

    it("allows admin to resolve disputes", () => {
      simnet.callPublicFn(
        "predinex-pool",
        "create-pool",
        [
          Cl.stringAscii("Resolve Dispute"),
          Cl.stringAscii("Desc"),
          Cl.stringAscii("A"),
          Cl.stringAscii("B"),
          Cl.uint(100)
        ],
        deployer
      );

      simnet.callPublicFn(
        "predinex-pool",
        "settle-pool",
        [Cl.uint(0), Cl.uint(0)],
        deployer
      );

      simnet.callPublicFn(
        "predinex-pool",
        "challenge-settlement",
        [Cl.uint(0), Cl.stringAscii("Challenge")],
        wallet1
      );

      // Resolve dispute (uphold settlement)
      const resolve = simnet.callPublicFn(
        "predinex-pool",
        "resolve-dispute",
        [Cl.uint(0), Cl.uint(0), Cl.bool(true)],
        deployer
      );

      expect(resolve.result).toBeOk(Cl.bool(true));
    });
  });
});

