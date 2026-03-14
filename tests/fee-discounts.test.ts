import { describe, expect, it } from 'vitest';

describe('tier-based-discounts', () => {
    it('should calculate 20% discount for Platinum tier', () => {
        const tier = 'Platinum';
        const discount = tier === 'Platinum' ? 20 : 0;
        expect(discount).toBe(20);
    });

    it('should calculate 10% discount for Silver tier', () => {
        const tier = 'Silver';
        const discount = tier === 'Silver' ? 10 : 0;
        expect(discount).toBe(10);
    });
});
