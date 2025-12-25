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

    describe("Token Metadata", () => {
        it("should return correct token name", () => {
            const result = simnet.callReadOnlyFn(
                "erc20-token",
                "get-name",
                [],
                deployer
            );
            expect(result.result).toBeOk(Cl.stringAscii("PredinexToken"));
        });

        it("should return correct token symbol", () => {
            const result = simnet.callReadOnlyFn(
                "erc20-token",
                "get-symbol",
                [],
                deployer
            );
            expect(result.result).toBeOk(Cl.stringAscii("PDX"));
        });

        it("should return correct decimals", () => {
            const result = simnet.callReadOnlyFn(
                "erc20-token",
                "get-decimals",
                [],
                deployer
            );
            expect(result.result).toBeOk(Cl.uint(6));
        });

        it("should return correct token URI", () => {
            const result = simnet.callReadOnlyFn(
                "erc20-token",
                "get-token-uri",
                [],
                deployer
            );
            expect(result.result).toBeOk(Cl.some(Cl.stringAscii("https://predinex.com/token")));
        });
    });

    describe("Total Supply", () => {
        it("should return correct total supply", () => {
            const result = simnet.callReadOnlyFn(
                "erc20-token",
                "get-total-supply",
                [],
                deployer
            );
            expect(result.result).toBeOk(Cl.uint(1000000000000));
        });
    });

    describe("Balance Management", () => {
        it("should show deployer has initial supply", () => {
            const result = simnet.callReadOnlyFn(
                "erc20-token",
                "get-balance",
                [Cl.principal(deployer)],
                deployer
            );
            expect(result.result).toBe(Cl.uint(1000000000000));
        });

        it("should show zero balance for new accounts", () => {
            const result = simnet.callReadOnlyFn(
                "erc20-token",
                "get-balance",
                [Cl.principal(alice)],
                deployer
            );
            expect(result.result).toBe(Cl.uint(0));
        });
    });

    describe("Transfer Functionality", () => {
        it("should transfer tokens successfully", () => {
            const transferAmount = 1000000; // 1 token

            const result = simnet.callPublicFn(
                "erc20-token",
                "transfer",
                [Cl.uint(transferAmount), Cl.principal(alice)],
                deployer
            );
            expect(result.result).toBeOk(Cl.bool(true));

            // Check balances after transfer
            const deployerBalance = simnet.callReadOnlyFn(
                "erc20-token",
                "get-balance",
                [Cl.principal(deployer)],
                deployer
            );
            expect(deployerBalance.result).toBe(Cl.uint(1000000000000 - transferAmount));

            const aliceBalance = simnet.callReadOnlyFn(
                "erc20-token",
                "get-balance",
                [Cl.principal(alice)],
                deployer
            );
            expect(aliceBalance.result).toBe(Cl.uint(transferAmount));
        });

        it("should fail when transferring more than balance", () => {
            const result = simnet.callPublicFn(
                "erc20-token",
                "transfer",
                [Cl.uint(2000000000000), Cl.principal(alice)], // More than total supply
                deployer
            );
            expect(result.result).toBeErr(Cl.uint(402)); // ERR-INSUFFICIENT-BALANCE
        });
    });
});
