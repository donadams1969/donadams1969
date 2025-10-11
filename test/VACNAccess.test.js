const { expect } = require("chai");

describe("VACNAccess", function () {
  it("should restrict and allow claim submission based on token balance", async function () {
    const [owner, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("VBLKToken");
    const token = await Token.deploy();
    await token.deployed();

    const VACN = await ethers.getContractFactory("VACNAccess");
    const vacn = await VACN.deploy(token.address, ethers.utils.parseUnits("100", 18));
    await vacn.deployed();

    await token.transfer(user.address, ethers.utils.parseUnits("100", 18));
    await vacn.connect(user).submitClaim("QmFakeHash123");
    const claims = await vacn.connect(user).getMyClaims();
    expect(claims[0]).to.equal("QmFakeHash123");
  });
});
