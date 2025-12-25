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
});
