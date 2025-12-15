import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("financial integrity and withdrawals", () => {

    it("deducts exactly 2% fee on settlement", () => {
        const poolId = 0;
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Fee Test"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        simnet.callPublicFn("predinex-pool", "place-bet", [Cl.uint(poolId), Cl.uint(0), Cl.uint(1000000)], wallet1);

        const settle = simnet.callPublicFn("predinex-pool", "settle-pool", [Cl.uint(poolId), Cl.uint(0)], deployer);

        const transferEvents = settle.events.filter(e => e.event === 'stx_transfer_event');
        const feeEvent = transferEvents.find(e => e.data.recipient === deployer && e.data.amount === '20000');
        expect(feeEvent).toBeDefined();
    });

    it("verifies request, approve, and execute withdrawal flow", () => {
        const poolId = 0;
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Withdrawal"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);
        simnet.callPublicFn("predinex-pool", "place-bet", [Cl.uint(poolId), Cl.uint(0), Cl.uint(1000000)], wallet1);
        simnet.callPublicFn("predinex-pool", "settle-pool", [Cl.uint(poolId), Cl.uint(0)], deployer);

        const request = simnet.callPublicFn("predinex-pool", "request-withdrawal",
            [Cl.uint(poolId), Cl.uint(500000)], wallet1);
        const withdrawalId = 0;
        expect(request.result).toBeOk(Cl.uint(withdrawalId));

        const pending = simnet.callReadOnlyFn("predinex-pool", "get-pending-withdrawal",
            [Cl.principal(wallet1), Cl.uint(withdrawalId)], deployer);

        // @ts-ignore
        const withdrawalData = pending.result.value.value;
        expect(withdrawalData.status.value).toEqual("pending");
        expect(withdrawalData.amount.value.toString()).toEqual("500000");

        const approve = simnet.callPublicFn("predinex-pool", "approve-withdrawal",
            [Cl.principal(wallet1), Cl.uint(withdrawalId)], deployer);
        expect(approve.result).toBeOk(Cl.bool(true));

        const transferEvents = approve.events.filter(e => e.event === 'stx_transfer_event');
        const withdrawEvent = transferEvents.find(e => e.data.recipient === wallet1 && e.data.amount === '500000');
        expect(withdrawEvent).toBeDefined();

        const history = simnet.callReadOnlyFn("predinex-pool", "get-withdrawal-history",
            [Cl.principal(wallet1), Cl.uint(withdrawalId)], deployer);
        // @ts-ignore
        const historyData = history.result.value.value;
        expect(historyData.amount.value.toString()).toEqual("500000");
    });

    it("prevents withdrawing more than user bet", () => {
        const poolId = 0;
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Overshoot"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);
        simnet.callPublicFn("predinex-pool", "place-bet", [Cl.uint(poolId), Cl.uint(0), Cl.uint(1000000)], wallet1);
        simnet.callPublicFn("predinex-pool", "settle-pool", [Cl.uint(poolId), Cl.uint(0)], deployer);

        const request = simnet.callPublicFn("predinex-pool", "request-withdrawal",
            [Cl.uint(poolId), Cl.uint(1000001)], wallet1);
        expect(request.result).toBeErr(Cl.uint(426));
    });

    it("verifies reject withdrawal flow", () => {
        const poolId = 0;
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Reject"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);
        simnet.callPublicFn("predinex-pool", "place-bet", [Cl.uint(poolId), Cl.uint(0), Cl.uint(1000000)], wallet1);
        simnet.callPublicFn("predinex-pool", "settle-pool", [Cl.uint(poolId), Cl.uint(0)], deployer);

        simnet.callPublicFn("predinex-pool", "request-withdrawal", [Cl.uint(poolId), Cl.uint(500000)], wallet1);
        const withdrawalId = 0;

        const reject = simnet.callPublicFn("predinex-pool", "reject-withdrawal",
            [Cl.principal(wallet1), Cl.uint(withdrawalId)], deployer);
        expect(reject.result).toBeOk(Cl.bool(true));

        const pending = simnet.callReadOnlyFn("predinex-pool", "get-pending-withdrawal",
            [Cl.principal(wallet1), Cl.uint(withdrawalId)], deployer);
        // @ts-ignore
        const data = pending.result.value.value;
        expect(data.status.value).toEqual("rejected");
    });
});
