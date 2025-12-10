import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("refund-mechanism functionality", () => {
    it("allows refund if pool expired and not settled", () => {
        // 1. Create Pool (ID 0) with duration 10 blocks
        // Current block height is likely u1 in simnet
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Refund?"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(10)], deployer);

        // 2. Wallet 1 bets 100 on Outcome A
        simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(0), Cl.uint(0), Cl.uint(100)], wallet1);

        // 3. Try refund immediately (Should fail - not expired)
        // Expiry = 1 + 10 = 11. Current = 1.
        const failRefund = simnet.callPublicFn("predinex-pool", "request-refund",
            [Cl.uint(0)], wallet1);
        expect(failRefund.result).toBeErr(Cl.uint(413)); // ERR-POOL-NOT-EXPIRED

        // 4. Advance chain to block 20 (Past expiry)
        simnet.mineEmptyBlocks(20);

        // 5. Try refund (Should succeed)
        const successRefund = simnet.callPublicFn("predinex-pool", "request-refund",
            [Cl.uint(0)], wallet1);
        expect(successRefund.result).toBeOk(Cl.bool(true));

        // 6. Try refund again (Should fail - already claimed)
        const doubleRefund = simnet.callPublicFn("predinex-pool", "request-refund",
            [Cl.uint(0)], wallet1);
        expect(doubleRefund.result).toBeErr(Cl.uint(410)); // ERR-ALREADY-CLAIMED
    });

    it("prevents refund if pool is settled", () => {
        // 1. Create Pool (ID 1)
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Settled?"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(10)], deployer);

        // 2. Wallet 1 bets
        simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(0), Cl.uint(0), Cl.uint(100)], wallet1);

        // 3. Settle Pool
        simnet.callPublicFn("predinex-pool", "settle-pool",
            [Cl.uint(0), Cl.uint(0)], deployer);

        // 4. Advance chain check (Past expiry)
        simnet.mineEmptyBlocks(20);

        // 5. Try refund (Should fail - settled)
        const settledRefund = simnet.callPublicFn("predinex-pool", "request-refund",
            [Cl.uint(0)], wallet1);
        expect(settledRefund.result).toBeErr(Cl.uint(409)); // ERR-POOL-SETTLED
    });
});
