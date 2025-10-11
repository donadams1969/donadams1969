const { expect } = require("chai");

describe("VBLKToken", function () {
  it("should deploy and mint initial supply", async function () {
    const [owner] = await ethers.getSigners();
    const VBLK = await ethers.getContractFactory("VBLKToken");
    const vblk = await VBLK.deploy();
    await vblk.deployed();

    const balance = await vblk.balanceOf(owner.address);
    expect(balance).to.equal(ethers.utils.parseUnits("1000000", 18));
  });
});
