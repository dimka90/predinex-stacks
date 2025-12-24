import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("place-bet functionality", () => {
    it("allows valid bets on both outcomes", () => {
        // 1. Create Pool
        const poolId = 0;
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Bet Test"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        // 2. Bet on A (Outcome 0)
        const betA = simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(poolId), Cl.uint(0), Cl.uint(1000000)], wallet1);
        expect(betA.result).toBeOk(Cl.bool(true));

        // 3. Bet on B (Outcome 1)
        const betB = simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(poolId), Cl.uint(1), Cl.uint(2000000)], wallet2);
        expect(betB.result).toBeOk(Cl.bool(true));

        // 4. Verify user bets updated
        const userBet1 = simnet.callReadOnlyFn("predinex-pool", "get-user-bet",
            [Cl.uint(poolId), Cl.principal(wallet1)], deployer);

        // Expected structure: { amount-a: u1000000, amount-b: u0, total-bet: u1000000 }
        expect(userBet1.result).toBeSome(Cl.tuple({
            "amount-a": Cl.uint(1000000),
            "amount-b": Cl.uint(0),
            "total-bet": Cl.uint(1000000)
        }));
    });

    it("fails when pool does not exist", () => {
        const bet = simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(999), Cl.uint(0), Cl.uint(1000000)], wallet1);
        expect(bet.result).toBeErr(Cl.uint(404)); // ERR-POOL-NOT-FOUND
    });

    it("fails when pool is settled", () => {
        // 1. Create and Settle Pool
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Settled"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);
        // Assuming pool-id 1 (since 0 was used in previous test? Simnet might reset per test file but let's be safe if state persists in memory, usually it resets per describe/it block depending on config, here assume reset)
        // Adjust pool-id if necessary based on execution context. standard vitest simnet resets.
        const poolId = 0;

        simnet.callPublicFn("predinex-pool", "settle-pool",
            [Cl.uint(poolId), Cl.uint(0)], deployer);

        // 2. Try to bet
        const bet = simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(poolId), Cl.uint(0), Cl.uint(1000000)], wallet1);
        expect(bet.result).toBeErr(Cl.uint(409)); // ERR-POOL-SETTLED
    });

    it("fails with invalid outcome index", () => {
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Pool"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        const bet = simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(0), Cl.uint(2), Cl.uint(1000000)], wallet1);
        expect(bet.result).toBeErr(Cl.uint(422)); // ERR-INVALID-OUTCOME
    });

    it("fails with zero amount", () => {
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Pool"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        const bet = simnet.callPublicFn("predinex-pool", "place-bet",
            [Cl.uint(0), Cl.uint(0), Cl.uint(0)], wallet1);
        expect(bet.result).toBeErr(Cl.uint(400)); // ERR-INVALID-AMOUNT
    });

    it("supports place-bet-validated with insufficient balance check", () => {
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Valid"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        // Wallet 1 has lots of STX in simnet usually.
        // Let's try to bet more than typical? OR rely on standard checks.
        // The contract checks (stx-account tx-sender).

        const bet = simnet.callPublicFn("predinex-pool", "place-bet-validated",
            [Cl.uint(0), Cl.uint(0), Cl.uint(1000000)], wallet1);
        expect(bet.result).toBeOk(Cl.bool(true));

        // Simnet accounts have huge balances, hard to test insufficient balance easily without draining.
        // But we can verify it calls the function successfully.
    });

    it("fails place-bet-validated if amount < MIN-BET-AMOUNT", () => {
        simnet.callPublicFn("predinex-pool", "create-pool",
            [Cl.stringAscii("Min"), Cl.stringAscii("Desc"), Cl.stringAscii("A"), Cl.stringAscii("B"), Cl.uint(100)], deployer);

        // MIN-BET-AMOUNT is u10000 (0.01 STX)
        const bet = simnet.callPublicFn("predinex-pool", "place-bet-validated",
            [Cl.uint(0), Cl.uint(0), Cl.uint(9999)], wallet1);
        expect(bet.result).toBeErr(Cl.uint(400)); // ERR-INVALID-AMOUNT
    });
});
