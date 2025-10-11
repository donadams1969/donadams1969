const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VALORAIPLUSGrokProvenance", function () {
    let provenanceContract, owner, addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        const ProvenanceContract = await ethers.getContractFactory("VALORAIPLUSGrokProvenance");
        provenanceContract = await ProvenanceContract.deploy();
        await provenanceContract.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the deployer as the owner", async function () {
            expect(await provenanceContract.owner()).to.equal(owner.address);
        });
    });

    describe("registerFile", function () {
        const fileHash = ethers.id("test-file-hash");
        const aiFingerprint = ethers.id("test-ai-fingerprint");
        const mnid = "MNID_SAINT_PAUL_1969_POPPA";
        const caid = "CAID_SGAU_POPPA_DONNY_GILLSON_7226.3461";
        const gyid = "GYID_1BILLION_MANDO25_2025";

        it("Should allow any address to register a new file", async function () {
            await expect(provenanceContract.connect(addr1).registerFile(
                fileHash,
                aiFingerprint,
                mnid,
                caid,
                gyid
            ))
            .to.emit(provenanceContract, "FileRegistered")
            .withArgs(fileHash, addr1.address, mnid, caid, gyid);

            const record = await provenanceContract.records(fileHash);
            expect(record.aiFingerprint).to.equal(aiFingerprint);
            expect(record.author).to.equal(addr1.address);
        });

        it("Should prevent registering the same file hash twice", async function () {
            await provenanceContract.registerFile(fileHash, aiFingerprint, mnid, caid, gyid);
            await expect(provenanceContract.registerFile(fileHash, aiFingerprint, mnid, caid, gyid))
                .to.be.revertedWith("File already registered");
        });
    });

    describe("verifyFile", function () {
        const fileHash = ethers.id("test-file-hash-verify");
        const aiFingerprint = ethers.id("test-ai-fingerprint-verify");
        const mnid = "MNID_VERIFY";
        const caid = "CAID_VERIFY";
        const gyid = "GYID_VERIFY";

        it("Should return the correct record for a registered file", async function () {
            await provenanceContract.registerFile(fileHash, aiFingerprint, mnid, caid, gyid);

            const record = await provenanceContract.verifyFile(fileHash);
            expect(record.fileHash).to.equal(fileHash);
            expect(record.aiFingerprint).to.equal(aiFingerprint);
            expect(record.mnid).to.equal(mnid);
            expect(record.caid).to.equal(caid);
            expect(record.gyid).to.equal(gyid);
        });

        it("Should revert for a file that is not registered", async function () {
            const unregisteredHash = ethers.id("unregistered-hash");
            await expect(provenanceContract.verifyFile(unregisteredHash))
                .to.be.revertedWith("File not registered");
        });
    });
});