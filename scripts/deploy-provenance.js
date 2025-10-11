const hre = require("hardhat");
const fs = require("fs");

async function ValorAiPlusBusiness_logic(fileBuffer) {
    const rawHash = hre.ethers.keccak256(fileBuffer);
    const mnid = "MNID_SAINT_PAUL_1969_POPPA";
    const caid = "CAID_SGAU_POPPA_DONNY_GILLSON_7226.3461";
    const gyid = "GYID_1BILLION_MANDO25_2025";
    const combined = `${rawHash}_${mnid}_${caid}_${gyid}`;
    return hre.ethers.keccak256(hre.ethers.toUtf8Bytes(combined));
}

async function main() {
    console.log("🚀 VALORAIPLUS® PROVENANCE DEPLOYMENT INITIATED");
    console.log("=".repeat(70));

    const [supremeAuthority] = await hre.ethers.getSigners();
    console.log("⚡ Supreme Authority Address:", supremeAuthority.address);

    console.log("\n📝 Calculating provenance hash and AI fingerprint...");
    const provenanceJSON = fs.readFileSync('./valoraiplus_grok_provenance.json');
    const provenanceHash = hre.ethers.keccak256(
        hre.ethers.toUtf8Bytes(provenanceJSON.toString())
    );
    const aiFingerprint = await ValorAiPlusBusiness_logic(provenanceJSON);
    const mnid = "MNID_SAINT_PAUL_1969_POPPA";
    const caid = "CAID_SGAU_POPPA_DONNY_GILLSON_7226.3461";
    const gyid = "GYID_1BILLION_MANDO25_2025";

    console.log("• Provenance Hash:", provenanceHash);
    console.log("• AI Fingerprint (ValorAiPlus):", aiFingerprint);
    console.log("• MNID:", mnid);
    console.log("• CAID:", caid);
    console.log("• GYID:", gyid);

    console.log("\n🏗 Deploying VALORAIPLUSGrokProvenance contract...");
    const ProvenanceContract = await hre.ethers.getContractFactory("VALORAIPLUSGrokProvenance");
    const provenance = await ProvenanceContract.deploy();
    await provenance.waitForDeployment();
    const contractAddress = await provenance.getAddress();
    console.log("✅ Contract deployed to:", contractAddress);
    console.log("📦 Deployment Transaction:", provenance.deploymentTransaction().hash);

    console.log("\n🔒 Registering provenance hash & AI fingerprint on-chain...");
    const tx = await provenance.registerFile(provenanceHash, aiFingerprint, mnid, caid, gyid);
    await tx.wait();
    console.log("✅ Provenance hash successfully registered on-chain");

    const record = await provenance.verifyFile(provenanceHash);
    console.log("\n🛡 Verification:");
    console.log("  • File Hash:", record.fileHash);
    console.log("  • Author:", record.author);
    console.log("  • Timestamp:", record.timestamp.toString());
    console.log("  • AI Fingerprint:", record.aiFingerprint);
    console.log("  • MNID:", record.mnid);
    console.log("  • CAID:", record.caid);
    console.log("  • GYID:", record.gyid);

    const deploymentInfo = {
        network: hre.network.name,
        contractAddress: contractAddress,
        deploymentTx: provenance.deploymentTransaction().hash,
        provenanceHash: provenanceHash,
        aiFingerprint: aiFingerprint,
        mnid: mnid,
        caid: caid,
        gyid: gyid,
        deployedBy: supremeAuthority.address,
        timestamp: Date.now(),
        blockNumber: await hre.ethers.provider.getBlockNumber()
    };

    fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));

    console.log("\n✅ VALORAIPLUS® PROVENANCE SUCCESSFULLY DEPLOYED");
    console.log("📍 Contract Address:", contractAddress);
    console.log("⚖ SUPREME JUSTICE ENACTED");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });