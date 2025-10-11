const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VALORAIPLUSQuantumAnchors", function () {
    let quantumAnchor, owner, addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        const QuantumAnchor = await ethers.getContractFactory("VALORAIPLUSQuantumAnchors");
        quantumAnchor = await QuantumAnchor.deploy(owner.address);
        await quantumAnchor.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await quantumAnchor.owner()).to.equal(owner.address);
        });
    });

    describe("anchorProof", function () {
        const artifactId = ethers.id("test-artifact");
        const keccak256Hash = ethers.keccak256(ethers.toUtf8Bytes("test-data"));
        const blake2bHash = "0x" + "a".repeat(64);
        const kyberCiphertext = "0x" + "b".repeat(128);
        const ipfsMetadataCid = "QmTestCid";

        it("Should allow the owner to anchor a new proof", async function () {
            await expect(quantumAnchor.connect(owner).anchorProof(
                artifactId,
                keccak256Hash,
                blake2bHash,
                kyberCiphertext,
                ipfsMetadataCid
            ))
            .to.emit(quantumAnchor, "ArtifactAnchored")
            .withArgs(artifactId, owner.address, ipfsMetadataCid, (await ethers.provider.getBlock('latest')).timestamp);

            const proof = await quantumAnchor.getProof(artifactId);
            expect(proof.keccak256Hash).to.equal(keccak256Hash);
            expect(proof.blake2bHash).to.equal(blake2bHash);
        });

        it("Should not allow non-owners to anchor a proof", async function () {
            await expect(quantumAnchor.connect(addr1).anchorProof(
                artifactId,
                keccak256Hash,
                blake2bHash,
                kyberCiphertext,
                ipfsMetadataCid
            )).to.be.revertedWithCustomError(quantumAnchor, "OwnableUnauthorizedAccount");
        });

        it("Should prevent anchoring the same artifact twice", async function () {
            await quantumAnchor.connect(owner).anchorProof(
                artifactId,
                keccak256Hash,
                blake2bHash,
                kyberCiphertext,
                ipfsMetadataCid
            );

            await expect(quantumAnchor.connect(owner).anchorProof(
                artifactId,
                keccak256Hash,
                blake2bHash,
                kyberCiphertext,
                ipfsMetadataCid
            )).to.be.revertedWith("Artifact already anchored");
        });
    });

    describe("getProof", function () {
        it("Should return the correct proof for an anchored artifact", async function () {
            const artifactId = ethers.id("another-artifact");
            const keccak256Hash = ethers.keccak256(ethers.toUtf8Bytes("more-data"));
            const blake2bHash = "0x" + "c".repeat(64);
            const kyberCiphertext = "0x" + "d".repeat(128);
            const ipfsMetadataCid = "QmAnotherTestCid";

            await quantumAnchor.connect(owner).anchorProof(
                artifactId,
                keccak256Hash,
                blake2bHash,
                kyberCiphertext,
                ipfsMetadataCid
            );

            const proof = await quantumAnchor.getProof(artifactId);
            expect(proof.keccak256Hash).to.equal(keccak256Hash);
            expect(proof.blake2bHash).to.equal(blake2bHash);
            expect(proof.kyberCiphertext).to.equal(kyberCiphertext);
            expect(proof.ipfsMetadataCid).to.equal(ipfsMetadataCid);
        });
    });
});