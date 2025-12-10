import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;

describe("data-validation functionality", () => {
    it("prevents creating pool with empty title", () => {
        const result = simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii(""), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(10)], deployer);
        expect(result.result).toBeErr(Cl.uint(420)); // ERR-INVALID-TITLE
    });

    it("prevents creating pool with empty description", () => {
        const result = simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Title"), Cl.stringAscii(""), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(10)], deployer);
        expect(result.result).toBeErr(Cl.uint(421)); // ERR-INVALID-DESCRIPTION
    });

    it("prevents creating pool with empty outcome", () => {
        // Outcome A empty
        const resultA = simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Title"), Cl.stringAscii("Desc"), Cl.stringAscii(""), Cl.stringAscii("B"), Cl.uint(10)], deployer);
        expect(resultA.result).toBeErr(Cl.uint(422)); // ERR-INVALID-OUTCOME

        // Outcome B empty
        const resultB = simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Title"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii(""), Cl.uint(10)], deployer);
        expect(resultB.result).toBeErr(Cl.uint(422)); // ERR-INVALID-OUTCOME
    });

    it("prevents creating pool with zero duration", () => {
        const result = simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Title"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(0)], deployer);
        expect(result.result).toBeErr(Cl.uint(423)); // ERR-INVALID-DURATION
    });
});
