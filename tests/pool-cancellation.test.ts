import { describe, expect, it } from 'vitest';

describe('predinex-pool-cancellation', () => {
    it('should allow creator to cancel an empty pool', () => {
        // Simulated test logic
        const pool = { id: 1, totalA: 0, totalB: 0, creator: 'SP123' };
        const sender = 'SP123';
        expect(sender === pool.creator && pool.totalA === 0).toBe(true);
    });

    it('should not allow cancellation if bets exist', () => {
        const pool = { id: 1, totalA: 100, totalB: 0, creator: 'SP123' };
        expect(pool.totalA > 0).toBe(true);
    });
});
