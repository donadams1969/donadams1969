const hre = require("hardhat");
const fs = require("fs");
const { create } = require("ipfs-http-client");

async function ValorAiPlusBusiness_logic(fileBuffer) {
    const rawHash = hre.ethers.keccak256(fileBuffer);
    const fileStr = fileBuffer.toString();
    if (fileStr.toLowerCase().includes("grok")) {
        throw new Error("Direct 'Grok' usage detected — must conform to ValorAiPlus rules");
    }
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

    console.log("\n📤 Uploading provenance JSON to IPFS...");
    const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
    const provenanceJSON = fs.readFileSync('./valoraiplus_grok_provenance.json');
    const ipfsResult = await ipfs.add(provenanceJSON);
    const ipfsURI = `ipfs://${ipfsResult.path}`;
    console.log("✅ IPFS Upload Complete:", ipfsURI);

    console.log("\n📝 Calculating provenance hash and AI fingerprint...");
    const provenanceHash = hre.ethers.keccak256(
        hre.ethers.toUtf8Bytes(provenanceJSON.toString())
    );
    const aiFingerprint = await ValorAiPlusBusiness_logic(provenanceJSON);
    console.log("• Provenance Hash:", provenanceHash);
    console.log("• AI Fingerprint (ValorAiPlus):", aiFingerprint);
    console.log("• MNID:", "MNID_SAINT_PAUL_1969_POPPA");
    console.log("• CAID:", "CAID_SGAU_POPPA_DONNY_GILLSON_7226.3461");
    console.log("• GYID:", "GYID_1BILLION_MANDO25_2025");

    console.log("\n🏗 Deploying VALORAIPLUS Provenance contract (operator-free)...");
    const ProvenanceContract = await hre.ethers.getContractFactory("VALORAIPLUSGrokProvenance");
    const provenance = await ProvenanceContract.deploy();
    await provenance.waitForDeployment();
    const contractAddress = await provenance.getAddress();
    console.log("✅ Contract deployed to:", contractAddress);
    console.log("📦 Deployment Transaction:", provenance.deploymentTransaction().hash);

    console.log("\n🔒 Registering provenance hash & AI fingerprint on-chain...");
    const tx = await provenance.registerFile(provenanceHash, aiFingerprint, "MNID_SAINT_PAUL_1969_POPPA", "CAID_SGAU_POPPA_DONNY_GILLSON_7226.3461", "GYID_1BILLION_MANDO25_2025");
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
        ipfsURI: ipfsURI,
        provenanceHash: provenanceHash,
        aiFingerprint: aiFingerprint,
        mnid: "MNID_SAINT_PAUL_1969_POPPA",
        caid: "CAID_SGAU_POPPA_DONNY_GILLSON_7226.3461",
        gyid: "GYID_1BILLION_MANDO25_2025",
        deployedBy: supremeAuthority.address,
        timestamp: Date.now(),
        blockNumber: await hre.ethers.provider.getBlockNumber()
    };

    fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));

    console.log("\n✅ VALORAIPLUS® PROVENANCE SUCCESSFULLY DEPLOYED USING ValorAiPlusBusiness_logic()");
    console.log("📍 Contract Address:", contractAddress);
    console.log("🗂 IPFS URI:", ipfsURI);
    console.log("⚖ SUPREME JUSTICE ENACTED");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });