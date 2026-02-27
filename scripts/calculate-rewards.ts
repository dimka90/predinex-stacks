function calculateRewards(betA: number, betB: number, totalA: number, totalB: number, winner: 'A' | 'B') {
    const FEE_PERCENT = 0.02;
    const totalPool = totalA + totalB;
    const fee = totalPool * FEE_PERCENT;
    const netPool = totalPool - fee;

    if (winner === 'A') {
        if (totalA === 0) return 0;
        return (betA / totalA) * netPool;
    } else {
        if (totalB === 0) return 0;
        return (betB / totalB) * netPool;
    }
}

// Example usage
const betA = 100000;
const totalA = 1000000;
const totalB = 800000;
const reward = calculateRewards(betA, 0, totalA, totalB, 'A');

console.log(`💰 Reward Calculation Preview:`);
console.log(`   Your Bet: ${betA / 1000000} STX`);
console.log(`   Total A: ${totalA / 1000000} STX`);
console.log(`   Total B: ${totalB / 1000000} STX`);
console.log(`   Potential Winnings: ${reward / 1000000} STX`);
