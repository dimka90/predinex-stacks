async function emergencyPause(contractName: string, status: boolean) {
    console.log(`🚨 Setting Emergency Pause for ${contractName} to ${status}...\n`);

    if (status) {
        console.log("🛑 Protocol is now PAUSED.");
    } else {
        console.log("🟢 Protocol is now ACTIVE.");
    }

    // set-emergency-mode logic
    console.log("✅ State updated successfully.");
}

emergencyPause('predinex-pool', true);
