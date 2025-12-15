import { describe, it, expect } from 'vitest';
import { Cl, ClarityType } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("state constitution and lifecycle", () => {
    it("verify pool created -> active -> settled state transition", () => {
        // 1. Created
        const poolId = 0;
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Lifecycle"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        const poolInit = simnet.callReadOnlyFn("predinex-pool", "get-pool", [Cl.uint(poolId)], deployer);

        expect(poolInit.result.type).toBe(ClarityType.OptionalSome);
        // @ts-ignore
        const initData = poolInit.result.value.value;
        // initData.settled should be false -> type: "false"
        expect(initData.settled.type).toBe("false");

        // 2. Active (Place bet)
        simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(poolId), Cl.uint(0), Cl.uint(1000000)], wallet1);

        // 3. Settled
        simnet.callPublicFn("predinex-pool", "settle-pool",
            [Cl.uint(poolId), Cl.uint(0)], deployer);

        const poolSettled = simnet.callReadOnlyFn("predinex-pool", "get-pool", [Cl.uint(poolId)], deployer);

        expect(poolSettled.result.type).toBe(ClarityType.OptionalSome);
        // @ts-ignore
        const settledData = poolSettled.result.value.value;
        expect(settledData.settled.type).toBe("true");
        expect(settledData["winning-outcome"].value.value.toString()).toBe("0");
    });

    it("verify pool expiry and refund lifecycle", () => {
        // 1. Create with short duration
        const poolId = 0;
        const duration = 10;
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Expiry"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(duration)], deployer);

        // 2. Bet
        simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(poolId), Cl.uint(0), Cl.uint(1000000)], wallet1);

        // 3. Advance blocks past expiry
        simnet.mineEmptyBlocks(duration + 5);

        // 4. Request refund
        const refund = simnet.callPublicFn("predinex-pool", "request-refund",
            [Cl.uint(poolId)], wallet1);
        expect(refund.result).toBeOk(Cl.bool(true));

        // 5. Verify claimed
        const doubleRefund = simnet.callPublicFn("predinex-pool", "request-refund",
            [Cl.uint(poolId)], wallet1);
        expect(doubleRefund.result).toBeErr(Cl.uint(410));
    });

    it("prevents refund if not expired", () => {
        // 1. Create
        const poolId = 0;
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Not Expired"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(poolId), Cl.uint(0), Cl.uint(1000000)], wallet1);

        // 2. Try Refund
        const refund = simnet.callPublicFn("predinex-pool", "request-refund",
            [Cl.uint(poolId)], wallet1);
        expect(refund.result).toBeErr(Cl.uint(413));
    });

    it("prevents refund if settled", () => {
        // 1. Create and Settle
        const poolId = 0;
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Settled Refund"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(10)], deployer);

        simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(poolId), Cl.uint(0), Cl.uint(1000000)], wallet1);

        simnet.callPublicFn("predinex-pool", "settle-pool",
            [Cl.uint(poolId), Cl.uint(0)], deployer);

        // Advance past expiry just to be sure
        simnet.mineEmptyBlocks(20);

        // 2. Try Refund
        const refund = simnet.callPublicFn("predinex-pool", "request-refund",
            [Cl.uint(poolId)], wallet1);
        expect(refund.result).toBeErr(Cl.uint(409));
    });
});
