import { describe, it, expect } from 'vitest';
import { Cl, ClarityType } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("read-only functions functionality", () => {

    it("verify get-pool returns correct data", () => {
        const poolId = 0;
        const title = "Read Only";
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii(title), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        const result = simnet.callReadOnlyFn("predinex-pool", "get-pool",
            [Cl.uint(poolId)], deployer);

        expect(result.result.type).toBe(ClarityType.OptionalSome);
        // @ts-ignore
        const data = result.result.value.value;
        // Fix: accessing .value for ascii strings
        expect(data.title.value).toEqual(title);
        expect(data.creator.value).toEqual(deployer);
        expect(data["total-a"].value.toString()).toEqual("0");
    });

    it("verify get-pool-info-formatted returns formatted data", () => {
        const poolId = 0;
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Formatted"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        const result = simnet.callReadOnlyFn("predinex-pool", "get-pool-info-formatted",
            [Cl.uint(poolId)], deployer);

        expect(result.result.type).toBe(ClarityType.ResponseOk);
        // @ts-ignore
        const data = result.result.value.value;
        expect(data["pool-id"].value.toString()).toEqual("0");
        expect(data.title.value).toEqual("Formatted");
    });

    it("verify get-pool-stats returns comprehensive stats", () => {
        const poolId = 0;
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Stats"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        simnet.callPublicFn("predinex-pool", "place-bet", [Cl.uint(poolId), Cl.uint(0), Cl.uint(100)], wallet1);
        simnet.callPublicFn("predinex-pool", "place-bet", [Cl.uint(poolId), Cl.uint(1), Cl.uint(100)], wallet1);

        const result = simnet.callReadOnlyFn("predinex-pool", "get-pool-stats",
            [Cl.uint(poolId)], deployer);

        expect(result.result.type).toBe(ClarityType.ResponseOk);
        // @ts-ignore
        const data = result.result.value.value;
        expect(data["total-pool"].value.toString()).toEqual("200");
        expect(data["percentage-a"].value.toString()).toEqual("50");
    });

    it("verify get-user-total-activity returns correct volume", () => {
        const poolId = 0;
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Activity"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        simnet.callPublicFn("predinex-pool", "place-bet", [Cl.uint(poolId), Cl.uint(0), Cl.uint(500)], wallet1);

        const result = simnet.callReadOnlyFn("predinex-pool", "get-user-total-activity",
            [Cl.principal(wallet1)], deployer);

        expect(result.result.type).toBe(ClarityType.Tuple);
        // @ts-ignore
        const data = result.result.value;
        expect(data["total-volume"].value.toString()).toEqual("500");
    });

    it("verify batch pool fetching", () => {
        for (let i = 0; i < 3; i++) {
            simnet.callPublicFn("predinex-pool", "create-pool",
                [Cl.stringAscii(`Pool ${i}`), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);
        }

        const result = simnet.callReadOnlyFn("predinex-pool", "get-pools-batch",
            [Cl.uint(0), Cl.uint(3)], deployer);

        expect(result.result.type).toBe(ClarityType.ResponseOk);
        // @ts-ignore
        const list = result.result.value.value;
        expect(list.length).toBe(5);
    });
});
