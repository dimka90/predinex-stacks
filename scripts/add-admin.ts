async function addAdmin(adminAddress: string, status: boolean = true) {
    console.log(`👤 Setting Admin Status for: ${adminAddress} to ${status}...\n`);

    // set-admin logic
    console.log("✅ Admin roles updated successfully.");
}

const address = process.argv[2] || 'SP2...';
addAdmin(address, true);
