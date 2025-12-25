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

        it("should fail when transferring to self", () => {
            const result = simnet.callPublicFn(
                "erc20-token",
                "transfer",
                [Cl.uint(1000000), Cl.principal(deployer)],
                deployer
            );
            expect(result.result).toBeErr(Cl.uint(404)); // ERR-INVALID-RECIPIENT
        });
    });

    describe("Approval and Transfer-From", () => {
        beforeEach(() => {
            // Transfer some tokens to Alice first
            simnet.callPublicFn(
                "erc20-token",
                "transfer",
                [Cl.uint(10000000), Cl.principal(alice)], // 10 tokens
                deployer
            );
        });

        it("should approve spender successfully", () => {
            const approveAmount = 5000000; // 5 tokens

            const result = simnet.callPublicFn(
                "erc20-token",
                "approve",
                [Cl.principal(bob), Cl.uint(approveAmount)],
                alice
            );
            expect(result.result).toBeOk(Cl.bool(true));

            // Check allowance
            const allowance = simnet.callReadOnlyFn(
                "erc20-token",
                "get-allowance",
                [Cl.principal(alice), Cl.principal(bob)],
                deployer
            );
            expect(allowance.result).toBe(Cl.uint(approveAmount));
        });

        it("should transfer-from with valid allowance", () => {
            const approveAmount = 5000000;
            const transferAmount = 3000000;

            // Approve Bob
            simnet.callPublicFn(
                "erc20-token",
                "approve",
                [Cl.principal(bob), Cl.uint(approveAmount)],
                alice
            );

            // Bob transfers from Alice
            const result = simnet.callPublicFn(
                "erc20-token",
                "transfer-from",
                [Cl.principal(alice), Cl.principal(bob), Cl.uint(transferAmount)],
                bob
            );
            expect(result.result).toBeOk(Cl.bool(true));

            const remainingAllowance = simnet.callReadOnlyFn(
                "erc20-token",
                "get-allowance",
                [Cl.principal(alice), Cl.principal(bob)],
                deployer
            );
            expect(remainingAllowance.result).toBe(Cl.uint(approveAmount - transferAmount));
        });
    });

    describe("Mint and Burn", () => {
        it("should mint tokens successfully (owner only)", () => {
            const mintAmount = 5000000; // 5 tokens

            const result = simnet.callPublicFn(
                "erc20-token",
                "mint",
                [Cl.uint(mintAmount), Cl.principal(alice)],
                deployer
            );
            expect(result.result).toBeOk(Cl.bool(true));

            // Check Alice's balance
            const aliceBalance = simnet.callReadOnlyFn(
                "erc20-token",
                "get-balance",
                [Cl.principal(alice)],
                deployer
            );
            expect(aliceBalance.result).toBe(Cl.uint(mintAmount)); // Alice starts with 0 in this test due to isolation
        });

        it("should fail mint from non-owner", () => {
            const result = simnet.callPublicFn(
                "erc20-token",
                "mint",
                [Cl.uint(5000000), Cl.principal(alice)],
                alice
            );
            expect(result.result).toBeErr(Cl.uint(401)); // ERR-UNAUTHORIZED
        });
    });
});
