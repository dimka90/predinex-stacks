import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("claim-winnings functionality", () => {
    it("allows winning bets to claim earnings", () => {
        // 1. Create Pool (ID 0)
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Win?"), Cl.stringAscii("Desc"), Cl.stringAscii("Yes"), Cl.stringAscii("No")], deployer);

        // 2. Wallet 1 bets 100 on Outcome 0 (Yes)
        // Needs STX first? Simnet accounts usually have STX.
        simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(0), Cl.uint(0), Cl.uint(100)], wallet1);

        // 3. Wallet 2 bets 100 on Outcome 1 (No)
        simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(0), Cl.uint(1), Cl.uint(100)], wallet2);

        // 4. Settle Pool (Outcome 0 wins)
        simnet.callPublicFn("predinex-pool", "settle-pool",
            [Cl.uint(0), Cl.uint(0)], deployer);

        // 5. Wallet 1 claims (Should succeed) - Total Pool 200. W1 share = (100 * 200) / 100 = 200.
        const claim1 = simnet.callPublicFn("predinex-pool", "claim-winnings",
            [Cl.uint(0)], wallet1);

        expect(claim1.result).toBeOk(Cl.bool(true));

        // 6. Wallet 2 claims (Should fail with ERR-NO-WINNINGS (u411))
        const claim2 = simnet.callPublicFn("predinex-pool", "claim-winnings",
            [Cl.uint(0)], wallet2);

        expect(claim2.result).toBeErr(Cl.uint(411));

        // 7. Wallet 1 claims again (Should fail with ERR-ALREADY-CLAIMED (u410))
        const claim1Again = simnet.callPublicFn("predinex-pool", "claim-winnings",
            [Cl.uint(0)], wallet1);

        expect(claim1Again.result).toBeErr(Cl.uint(410));
    });
});
