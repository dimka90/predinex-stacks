import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("platform-fees functionality", () => {
    it("deducts 2% fee on settlement", () => {
        // 1. Create Pool (ID 0)
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Fee Test"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        // 2. Bet 100 on A (Wallet 1)
        simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(0), Cl.uint(0), Cl.uint(100)], wallet1);

        // 3. Bet 100 on B (Wallet 2)
        simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(0), Cl.uint(1), Cl.uint(100)], wallet2);

        // Total Pool: 200. Fee (2%): 4. Net Pool: 196.

        // 4. Settle Pool (A wins)
        const settle = simnet.callPublicFn("predinex-pool", "settle-pool",
            [Cl.uint(0), Cl.uint(0)], deployer);

        expect(settle.result).toBeOk(Cl.bool(true));

        // Verify fee event? Simnet events are tricky.
        // Check asset transfer events in `settle.events`.
        // Expect: STX transfer 4 from contract to deployer (owner).

        // 5. Claim Winnings (Wallet 1)
        // Share = (100 * 196) / 100 = 196.
        // Wallet 1 should receive 196 STX.
        const claim = simnet.callPublicFn("predinex-pool", "claim-winnings",
            [Cl.uint(0)], wallet1);

        expect(claim.result).toBeOk(Cl.bool(true));

        // Verify transfer amount in events
        // Event 0: STX Transfer 196 from contract to wallet1
        // Filter STX transfer events
        const stxTransfers = claim.events.filter(e => e.event === 'stx_transfer_event');
        expect(stxTransfers.length).toBe(1);
        const payout = stxTransfers[0].data.amount;
        expect(payout).toEqual('196');
    });
});
