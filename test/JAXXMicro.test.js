const { expect } = require("chai");

describe("JAXXMicro", function () {
  it("should reward NFT holders", async function () {
    const [owner, user] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("MockNFT");
    const nft = await NFT.deploy();
    await nft.deployed();
    await nft.mint(user.address, 1);

    const JAXX = await ethers.getContractFactory("JAXXMicro");
    const jaxx = await JAXX.deploy(nft.address, 10);
    await jaxx.deployed();

    await jaxx.transferOwnership(owner.address);
    await jaxx.transfer(user.address, ethers.utils.parseUnits("1000", 18));

    await jaxx.issueReward(user.address, 1);
    const balance = await jaxx.balanceOf(user.address);
    expect(balance).to.be.above(ethers.utils.parseUnits("1000", 18));
  });
});
