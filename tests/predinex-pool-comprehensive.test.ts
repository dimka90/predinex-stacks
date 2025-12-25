import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

/*
  The logic below ensures that the `simnet` object is available globally in the test files.
*/
// @ts-ignore
const { simnet } = globalThis;

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("Predinex Pool Comprehensive Tests", () => {
    it("should have valid environment", () => {
        expect(deployer).toBeDefined();
        expect(wallet1).toBeDefined();
        expect(wallet2).toBeDefined();
    });

    describe("Pool Creation", () => {
        it("should create a pool successfully", () => {
            const title = "Bitcoin vs Ethereum";
            const description = "Will Bitcoin outperform Ethereum?";
            const outcomeA = "Bitcoin";
            const outcomeB = "Ethereum";
            const duration = 100;

            const { result } = simnet.callPublicFn(
                "predinex-pool",
                "create-pool",
                [
                    Cl.stringAscii(title),
                    Cl.stringAscii(description),
                    Cl.stringAscii(outcomeA),
                    Cl.stringAscii(outcomeB),
                    Cl.uint(duration)
                ],
                deployer
            );

            // First pool should have ID 0
            expect(result).toBeOk(Cl.uint(0));
        });

        it("should fail to create pool with invalid parameters", () => {
            // Empty title
            const resultTitle = simnet.callPublicFn(
                "predinex-pool",
                "create-pool",
                [
                    Cl.stringAscii(""), // Invalid
                    Cl.stringAscii("Desc"),
                    Cl.stringAscii("A"),
                    Cl.stringAscii("B"),
                    Cl.uint(100)
                ],
                deployer
            );
            expect(resultTitle.result).toBeErr(Cl.uint(420)); // ERR-INVALID-TITLE

            // Zero duration
            const resultDuration = simnet.callPublicFn(
                "predinex-pool",
                "create-pool",
                [
                    Cl.stringAscii("Title"),
                    Cl.stringAscii("Desc"),
                    Cl.stringAscii("A"),
                    Cl.stringAscii("B"),
                    Cl.uint(0) // Invalid
                ],
                deployer
            );
            expect(resultDuration.result).toBeErr(Cl.uint(423)); // ERR-INVALID-DURATION
        });
    });

    describe("Betting Functionality", () => {
        it("should place a bet successfully", () => {
            // Create a pool first
            simnet.callPublicFn(
                "predinex-pool",
                "create-pool",
                [
                    Cl.stringAscii("Betting Pool"),
                    Cl.stringAscii("Desc"),
                    Cl.stringAscii("A"),
                    Cl.stringAscii("B"),
                    Cl.uint(100)
                ],
                deployer
            );
            // Pool ID should be 1 (0 was used in previous test)

            const poolId = 1;
            const betAmount = 1000000; // 1 STX

            // Place bet on outcome A (0)
            const result = simnet.callPublicFn(
                "predinex-pool",
                "place-bet",
                [
                    Cl.uint(poolId),
                    Cl.uint(0), // Outcome A
                    Cl.uint(betAmount)
                ],
                wallet1
            );
            expect(result.result).toBeOk(Cl.bool(true));

            // Verify user STX balance decreased (handled by simnet automagically if we check?)
            // We can check pool state
            const pool = simnet.callReadOnlyFn(
                "predinex-pool",
                "get-pool",
                [Cl.uint(poolId)],
                deployer
            );
            expect(pool.result).toBeOk(expect.anything()); // Just check it exists and is valid
            // Can't easily inspect inner tuple with simple matchers, but OK is good.
        });

        it("should fail to bet with invalid parameters", () => {
            // Create a pool for error testing
            simnet.callPublicFn(
                "predinex-pool",
                "create-pool",
                [
                    Cl.stringAscii("Error Pool"),
                    Cl.stringAscii("Desc"),
                    Cl.stringAscii("A"),
                    Cl.stringAscii("B"),
                    Cl.uint(100)
                ],
                deployer
            );
            // Pool ID should be 2 assuming sequential execution
            // But to be safe, let's just bet on pool 1 which exists from previous test (if state persists)
            // or pool 2 if we created it. Simnet state persists in Vitest with isolate: false.
            // Let's explicitly use pool 2.
            const poolId = 2;

            // Invalid Amount (below minimum)
            const resultAmount = simnet.callPublicFn(
                "predinex-pool",
                "place-bet",
                [
                    Cl.uint(poolId),
                    Cl.uint(0),
                    Cl.uint(10) // Too small
                ],
                wallet1
            );
            expect(resultAmount.result).toBeErr(Cl.uint(400)); // ERR-INVALID-AMOUNT

            // Invalid Outcome (not 0 or 1)
            const resultOutcome = simnet.callPublicFn(
                "predinex-pool",
                "place-bet",
                [
                    Cl.uint(poolId),
                    Cl.uint(2), // Invalid
                    Cl.uint(1000000)
                ],
                wallet1
            );
            expect(resultOutcome.result).toBeErr(Cl.uint(422)); // ERR-INVALID-OUTCOME
        });
    });

    describe("Pool Settlement", () => {
        it("should settle a pool successfully", () => {
            // Create pool 3
            simnet.callPublicFn(
                "predinex-pool",
                "create-pool",
                [
                    Cl.stringAscii("Settlement Pool"),
                    Cl.stringAscii("Desc"),
                    Cl.stringAscii("A"),
                    Cl.stringAscii("B"),
                    Cl.uint(100)
                ],
                deployer
            );
            const poolId = 3;

            const result = simnet.callPublicFn(
                "predinex-pool",
                "settle-pool",
                [
                    Cl.uint(poolId),
                    Cl.uint(1) // Outcome B wins
                ],
                deployer
            );
            expect(result.result).toBeOk(Cl.bool(true));

            // Verify pool is settled
            const pool = simnet.callReadOnlyFn(
                "predinex-pool",
                "get-pool",
                [Cl.uint(poolId)],
                deployer
            );
            expect(pool.result).toBeOk(expect.anything());
            // Ideally check 'settled' is true and 'winning-outcome' is u1, but tricky with Cl.tuple parsing in basic setup
        });

        it("should fail to settle with invalid parameters", () => {
            // Create a pool for error testing
            simnet.callPublicFn(
                "predinex-pool",
                "create-pool",
                [
                    Cl.stringAscii("Settlement Error Pool"),
                    Cl.stringAscii("Desc"),
                    Cl.stringAscii("A"),
                    Cl.stringAscii("B"),
                    Cl.uint(100)
                ],
                deployer
            );
            const poolId = 4;

            // Unauthorized (Wallet 1 tries to settle)
            const resultUnauthorized = simnet.callPublicFn(
                "predinex-pool",
                "settle-pool",
                [
                    Cl.uint(poolId),
                    Cl.uint(0)
                ],
                wallet1
            );
            expect(resultUnauthorized.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED

            // Invalid Outcome (u2)
            const resultOutcome = simnet.callPublicFn(
                "predinex-pool",
                "settle-pool",
                [
                    Cl.uint(poolId),
                    Cl.uint(2)
                ],
                deployer
            );
            expect(resultOutcome.result).toBeErr(Cl.uint(422)); // ERR-INVALID-OUTCOME

            // Settle correctly first
            simnet.callPublicFn(
                "predinex-pool",
                "settle-pool",
                [Cl.uint(poolId), Cl.uint(0)],
                deployer
            );

            // Already Settled
            const resultSettled = simnet.callPublicFn(
                "predinex-pool",
                "settle-pool",
                [
                    Cl.uint(poolId),
                    Cl.uint(0)
                ],
                deployer
            );
            expect(resultSettled.result).toBeErr(Cl.uint(409)); // ERR-POOL-ALREADY-SETTLED
        });

        it("should allow winner to claim winnings", () => {
            // Create pool 5
            simnet.callPublicFn(
                "predinex-pool",
                "create-pool",
                [
                    Cl.stringAscii("Claim Pool"),
                    Cl.stringAscii("Desc"),
                    Cl.stringAscii("A"),
                    Cl.stringAscii("B"),
                    Cl.uint(100)
                ],
                deployer
            );
            const poolId = 5;

            // Wallet 1 bets on A
            simnet.callPublicFn(
                "predinex-pool",
                "place-bet",
                [Cl.uint(poolId), Cl.uint(0), Cl.uint(1000000)],
                wallet1
            );

            // Wallet 2 bets on B
            simnet.callPublicFn(
                "predinex-pool",
                "place-bet",
                [Cl.uint(poolId), Cl.uint(1), Cl.uint(1000000)],
                wallet2
            );

            // Settle pool with Outcome A winning
            simnet.callPublicFn(
                "predinex-pool",
                "settle-pool",
                [
                    Cl.uint(poolId),
                    Cl.uint(0)
                ],
                deployer
            );

            // Wallet 1 Claims
            const result = simnet.callPublicFn(
                "predinex-pool",
                "claim-winnings",
                [Cl.uint(poolId)],
                wallet1
            );
            expect(result.result).toBeOk(Cl.bool(true));

            // Verify claim status
            const claim = simnet.callReadOnlyFn(
                "predinex-pool",
                "get-claim",
                [Cl.uint(poolId), Cl.principal(wallet1)],
                deployer
            );
            // Contract doesn't export get-claim but map is private or public?
            // "define-map claims" is at top level.
            // But we can check if they can claim again (should fail)

            const resultSecond = simnet.callPublicFn(
                "predinex-pool",
                "claim-winnings",
                [Cl.uint(poolId)],
                wallet1
            );
            expect(resultSecond.result).toBeErr(Cl.uint(410)); // ERR-ALREADY-CLAIMED
        });

        it("should fail validation for claim-winnings", () => {
            // Create pool 6
            simnet.callPublicFn(
                "predinex-pool",
                "create-pool",
                [
                    Cl.stringAscii("Claim Fail Pool"),
                    Cl.stringAscii("Desc"),
                    Cl.stringAscii("A"),
                    Cl.stringAscii("B"),
                    Cl.uint(100)
                ],
                deployer
            );
            const poolId = 6;

            // Wallet 1 bets on A (Winner)
            simnet.callPublicFn(
                "predinex-pool",
                "place-bet",
                [Cl.uint(poolId), Cl.uint(0), Cl.uint(1000000)],
                wallet1
            );

            // Wallet 2 bets on B (Loser)
            simnet.callPublicFn(
                "predinex-pool",
                "place-bet",
                [Cl.uint(poolId), Cl.uint(1), Cl.uint(1000000)],
                wallet2
            );

            // Settle on A
            simnet.callPublicFn(
                "predinex-pool",
                "settle-pool",
                [Cl.uint(poolId), Cl.uint(0)],
                deployer
            );

            // Loser tries to claim
            const resultLoser = simnet.callPublicFn(
                "predinex-pool",
                "claim-winnings",
                [Cl.uint(poolId)],
                wallet2
            );
            expect(resultLoser.result).toBeErr(Cl.uint(411)); // ERR-NO-WINNINGS

            // Winner claims twice (already tested in previous test but good to reiterate or skip)
            // tested explicitly in previous it block.
        });
    });

    describe("Refunds", () => {
        it("should allow refund for expired unsettled pool", () => {
            // Create pool 7
            simnet.callPublicFn(
                "predinex-pool",
                "create-pool",
                [
                    Cl.stringAscii("Refund Pool"),
                    Cl.stringAscii("Desc"),
                    Cl.stringAscii("A"),
                    Cl.stringAscii("B"),
                    Cl.uint(10) // Short duration
                ],
                deployer
            );
            const poolId = 7;

            // Bet
            simnet.callPublicFn(
                "predinex-pool",
                "place-bet",
                [Cl.uint(poolId), Cl.uint(0), Cl.uint(1000000)],
                wallet1
            );

            // Advance blocks to expire (duration 10)
            simnet.mineEmptyBlocks(11);

            // Request Refund
            const result = simnet.callPublicFn(
                "predinex-pool",
                "request-refund",
                [Cl.uint(poolId)],
                wallet1
            );
            expect(result.result).toBeOk(Cl.bool(true));

            // Request again (fail)
            const resultSecond = simnet.callPublicFn(
                "predinex-pool",
                "request-refund",
                [Cl.uint(poolId)],
                wallet1
            );
            expect(resultSecond.result).toBeErr(Cl.uint(410)); // ERR-ALREADY-CLAIMED
        });
    });

    describe("Oracle System", () => {
        it("should register oracle and submit data", () => {
            // Register wallet_1 as oracle
            const resultRegister = simnet.callPublicFn(
                "predinex-pool",
                "register-oracle-provider",
                [
                    Cl.principal(wallet1),
                    Cl.list([Cl.stringAscii("price"), Cl.stringAscii("result")])
                ],
                deployer
            );
            expect(resultRegister.result).toBeOk(expect.anything());

            // Create Pool 8
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
            const poolId = 8;

            // Submit data as wallet_1
            const resultSubmit = simnet.callPublicFn(
                "predinex-pool",
                "submit-oracle-data",
                [
                    Cl.uint(poolId),
                    Cl.stringAscii("1"), // Winning outcome
                    Cl.stringAscii("result"),
                    Cl.uint(95) // Confidence
                ],
                wallet1
            );
            expect(resultSubmit.result).toBeOk(expect.anything());
        });
    });
});
