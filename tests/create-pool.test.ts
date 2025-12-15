import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;

describe("create-pool functionality", () => {
    it("creates a pool with valid arguments", () => {
        const { result } = simnet.callPublicFn(
            "predinex-pool",
            "create-pool",
            [
                Cl.stringAscii("Bitcoin vs Ethereum"),
                Cl.stringAscii("Will Bitcoin outperform Ethereum?"),
                Cl.stringAscii("Bitcoin"),
                Cl.stringAscii("Ethereum"),
                Cl.uint(100)
            ],
            deployer
        );
        expect(result).toBeOk(Cl.uint(0));
    });

    // ... (error cases are stateless so fine) ...

    it("fails to create pool with empty title", () => {
        const { result } = simnet.callPublicFn(
            "predinex-pool",
            "create-pool",
            [Cl.stringAscii(""), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)],
            deployer
        );
        expect(result).toBeErr(Cl.uint(420));
    });

    it("fails to create pool with empty description", () => {
        const result = simnet.callPublicFn("predinex-pool", "create-pool", [Cl.stringAscii("Title"), Cl.stringAscii(""), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);
        expect(result.result).toBeErr(Cl.uint(421));
    });

    it("fails to create pool with empty outcome", () => {
        const result = simnet.callPublicFn("predinex-pool", "create-pool", [Cl.stringAscii("Title"), Cl.stringAscii("Desc"), Cl.stringAscii(""), Cl.stringAscii("B"), Cl.uint(100)], deployer);
        expect(result.result).toBeErr(Cl.uint(422));
    });

    it("fails to create pool with 0 duration", () => {
        const result = simnet.callPublicFn("predinex-pool", "create-pool", [Cl.stringAscii("Title"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(0)], deployer);
        expect(result.result).toBeErr(Cl.uint(423));
    });

    it("creates pool with max length strings", () => {
        const longTitle = "a".repeat(256);
        const longDesc = "b".repeat(512);
        const longOutcome = "c".repeat(128);

        const { result } = simnet.callPublicFn(
            "predinex-pool",
            "create-pool",
            [
                Cl.stringAscii(longTitle),
                Cl.stringAscii(longDesc),
                Cl.stringAscii(longOutcome),
                Cl.stringAscii(longOutcome),
                Cl.uint(100)
            ],
            deployer
        );
        // Simnet resets, so should be u0
        expect(result).toBeOk(Cl.uint(0));
    });
});
