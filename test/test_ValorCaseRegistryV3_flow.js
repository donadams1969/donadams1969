const { expect } = require("chai");
const { ethers } = require("hardhat");
const { keccak256, toUtf8Bytes } = require("ethers");

describe("ValorCaseRegistryV3 State Machine", function () {
    let ValorCaseRegistryV3;
    let valorCaseRegistry;
    let owner, addr1, addr2, reviewer, moderator, closer;

    const cid = "QmZ3C7Z5C9Z5C9Z5C9Z5C9Z5C9Z5C9Z5C9Z5C9Z5C9Z5C9Z5C9Z5C";

    const REVIEWER_ROLE = keccak256(toUtf8Bytes("REVIEWER_ROLE"));
    const MODERATOR_ROLE = keccak256(toUtf8Bytes("MODERATOR_ROLE"));
    const CLOSER_ROLE = keccak256(toUtf8Bytes("CLOSER_ROLE"));

    beforeEach(async function () {
        [owner, addr1, addr2, reviewer, moderator, closer] = await ethers.getSigners();
        ValorCaseRegistryV3 = await ethers.getContractFactory("ValorCaseRegistryV3");
        valorCaseRegistry = await ValorCaseRegistryV3.deploy(owner.address);
    });

    it("Should correctly transition a case through the happy path", async function () {
        // Grant roles
        await valorCaseRegistry.grantRole(REVIEWER_ROLE, reviewer.address);
        await valorCaseRegistry.grantRole(MODERATOR_ROLE, moderator.address);
        await valorCaseRegistry.grantRole(CLOSER_ROLE, closer.address);

        // File a case
        await valorCaseRegistry.connect(addr1).fileCase(cid);
        let caseId = 1;

        // Reviewer moves to Reviewed
        await valorCaseRegistry.connect(reviewer).updateCaseStatus(caseId, 1, "Case reviewed", ""); // 1 = Reviewed
        let [caseDetails] = await valorCaseRegistry.getCase(caseId);
        expect(caseDetails.status).to.equal(1); // Reviewed

        // Moderator moves to InProgress
        await valorCaseRegistry.connect(moderator).updateCaseStatus(caseId, 2, "Case in progress", ""); // 2 = InProgress
        [caseDetails] = await valorCaseRegistry.getCase(caseId);
        expect(caseDetails.status).to.equal(2); // InProgress

        // Closer moves to Closed
        await valorCaseRegistry.connect(closer).updateCaseStatus(caseId, 3, "Case closed", ""); // 3 = Closed
        [caseDetails] = await valorCaseRegistry.getCase(caseId);
        expect(caseDetails.status).to.equal(3); // Closed
    });

    it("Should allow closer to reject a case", async function () {
        // Grant roles
        await valorCaseRegistry.grantRole(REVIEWER_ROLE, reviewer.address);
        await valorCaseRegistry.grantRole(MODERATOR_ROLE, moderator.address);
        await valorCaseRegistry.grantRole(CLOSER_ROLE, closer.address);

        await valorCaseRegistry.connect(addr1).fileCase(cid);
        let caseId = 1;

        await valorCaseRegistry.connect(reviewer).updateCaseStatus(caseId, 1, "Reviewed", "");
        await valorCaseRegistry.connect(moderator).updateCaseStatus(caseId, 2, "In Progress", "");

        // Closer moves to Rejected
        await valorCaseRegistry.connect(closer).updateCaseStatus(caseId, 4, "Case rejected", ""); // 4 = Rejected
        const [caseDetails] = await valorCaseRegistry.getCase(caseId);
        expect(caseDetails.status).to.equal(4); // Rejected
    });

    it("Should prevent invalid state transitions", async function () {
        // Grant roles
        await valorCaseRegistry.grantRole(MODERATOR_ROLE, moderator.address);
        await valorCaseRegistry.grantRole(CLOSER_ROLE, closer.address);

        await valorCaseRegistry.connect(addr1).fileCase(cid);
        let caseId = 1;

        // Should fail to go from Filed to InProgress
        await expect(
            valorCaseRegistry.connect(moderator).updateCaseStatus(caseId, 2, "Invalid transition", "")
        ).to.be.revertedWith("Invalid status change");

        // Should fail to go from Filed to Closed
        await expect(
            valorCaseRegistry.connect(closer).updateCaseStatus(caseId, 3, "Invalid transition", "")
        ).to.be.revertedWith("Invalid status change");
    });

    it("Should prevent unauthorized actors from changing status", async function () {
        // Grant roles
        await valorCaseRegistry.grantRole(REVIEWER_ROLE, reviewer.address);
        await valorCaseRegistry.grantRole(MODERATOR_ROLE, moderator.address);
        await valorCaseRegistry.grantRole(CLOSER_ROLE, closer.address);

        await valorCaseRegistry.connect(addr1).fileCase(cid);
        let caseId = 1;

        // Submitter cannot change status
        await expect(
            valorCaseRegistry.connect(addr1).updateCaseStatus(caseId, 1, "Unauthorized", "")
        ).to.be.revertedWith("Unauthorized");

        // Random address cannot change status
        await expect(
            valorCaseRegistry.connect(addr2).updateCaseStatus(caseId, 1, "Unauthorized", "")
        ).to.be.revertedWith("Unauthorized");

        // Reviewer cannot close a case
        await valorCaseRegistry.connect(reviewer).updateCaseStatus(caseId, 1, "Reviewed", "");
        await valorCaseRegistry.connect(moderator).updateCaseStatus(caseId, 2, "In Progress", "");
        await expect(
            valorCaseRegistry.connect(reviewer).updateCaseStatus(caseId, 3, "Unauthorized", "")
        ).to.be.revertedWith("Unauthorized");
    });
});