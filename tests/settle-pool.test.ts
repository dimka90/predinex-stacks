import { describe, it, expect } from 'vitest';
import { Cl, ClarityType } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("settle-pool functionality", () => {
    it("allows creator to settle pool", () => {
        // 1. Create Pool
        const poolId = 0;
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Settle Test"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        // 2. Bet
        simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(poolId), Cl.uint(0), Cl.uint(1000000)], wallet1);

        // 3. Settle
        const settle = simnet.callPublicFn("predinex-pool", "settle-pool",
            [Cl.uint(poolId), Cl.uint(0)], deployer);
        expect(settle.result).toBeOk(Cl.bool(true));

        // 4. Verify state
        const pool = simnet.callReadOnlyFn("predinex-pool", "get-pool",
            [Cl.uint(poolId)], deployer);

        expect(pool.result.type).toBe(ClarityType.OptionalSome);
        // @ts-ignore
        const data = pool.result.value.value;
        // Simnet returns type: "true" for true boolean
        expect(data.settled.type).toBe("true");

        // winning-outcome is (some u0) -> { type: 'some', value: { type: 'uint', value: '0' } }
        expect(data["winning-outcome"].type).toBe("some");
        expect(data["winning-outcome"].value.value.toString()).toBe("0");
    });

    it("prevents non-creator from settling pool", () => {
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Auth Test"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        const settle = simnet.callPublicFn("predinex-pool", "settle-pool",
            [Cl.uint(0), Cl.uint(0)], wallet1);
        expect(settle.result).toBeErr(Cl.uint(401));
    });

    it("prevents settling already settled pool", () => {
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Double Settle"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        // First settlement
        simnet.callPublicFn("predinex-pool", "settle-pool",
            [Cl.uint(0), Cl.uint(0)], deployer);

        const settle = simnet.callPublicFn("predinex-pool", "settle-pool",
            [Cl.uint(0), Cl.uint(1)], deployer);
        expect(settle.result).toBeErr(Cl.uint(409));
    });

    it("prevents invalid outcome", () => {
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Invalid Outcome"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        const settle = simnet.callPublicFn("predinex-pool", "settle-pool",
            [Cl.uint(0), Cl.uint(2)], deployer);
        expect(settle.result).toBeErr(Cl.uint(422));
    });

    it("supports settle-pool-enhanced and returns stats", () => {
        const poolId = 0;
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Enhanced"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(poolId), Cl.uint(0), Cl.uint(1000000)], wallet1);

        const settle = simnet.callPublicFn("predinex-pool", "settle-pool-enhanced",
            [Cl.uint(poolId), Cl.uint(0)], deployer);

        expect(settle.result.type).toBe(ClarityType.ResponseOk);
        // @ts-ignore
        const data = settle.result.value.value;
        expect(data["total-pool-balance"].value.toString()).toEqual("1000000");
        expect(data["winning-outcome"].value.toString()).toEqual("0");
    });
});
