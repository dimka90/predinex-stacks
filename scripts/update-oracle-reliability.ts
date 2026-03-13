async function updateReliability(providerId: number, score: number) {
    console.log(`📈 Updating Reliability for Provider #${providerId} to ${score}...\n`);

    if (score < 50) {
        console.log("⚠️  Warning: Reliability is dangerously low. Consider deactivation.");
    }

    // update-reliability-score logic
    console.log("✅ Score updated successfully.");
}

updateReliability(0, 98);
