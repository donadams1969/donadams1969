const { expect } = require("chai");

describe("DBLKVault", function () {
  it("should deploy and allow vault locking and approval", async function () {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("VBLKToken");
    const token = await Token.deploy();
    await token.deployed();

    const Vault = await ethers.getContractFactory("DBLKVault");
    const vault = await Vault.deploy(token.address, [owner.address], 1);
    await vault.deployed();

    await vault.lockUntil(Math.floor(Date.now() / 1000) + 1); // Lock for 1 second
    await new Promise(resolve => setTimeout(resolve, 1100));  // Wait

    await vault.approveUnlock();
    const approvals = await vault.getApprovalCount();
    expect(approvals).to.equal(1);
  });
});
