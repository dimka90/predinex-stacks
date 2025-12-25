import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

/*
  The logic below ensures that the `simnet` object is available globally in the test files.
*/
// @ts-ignore
const { simnet } = globalThis;

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const alice = accounts.get("wallet_1")!;
const bob = accounts.get("wallet_2")!;

describe("ERC20 Comprehensive Tests", () => {
    beforeEach(() => {
        // Initialize token with 1,000,000 tokens (with 6 decimals)
        const initResult = simnet.callPublicFn(
            "erc20-token",
            "initialize",
            [Cl.uint(1000000000000)], // 1M tokens with 6 decimals
            deployer
        );
        expect(initResult.result).toBeOk(Cl.bool(true));
    });

    it("should have valid environment", () => {
        expect(deployer).toBeDefined();
        expect(alice).toBeDefined();
        expect(bob).toBeDefined();
    });
});
