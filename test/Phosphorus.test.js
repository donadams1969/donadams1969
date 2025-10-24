const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Phosphorus Protocol", function () {
  let PHOS_R, phosR, PHOS_W, phosW, Matchstrike, matchstrike, Fertilizer, fertilizer, ATP, atp, DNA, dna, AcidBoost, acidBoost;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    PHOS_R = await ethers.getContractFactory("PHOS_R");
    phosR = await PHOS_R.deploy(owner.address);

    PHOS_W = await ethers.getContractFactory("PHOS_W");
    phosW = await PHOS_W.deploy(owner.address);

    Matchstrike = await ethers.getContractFactory("Matchstrike");
    matchstrike = await Matchstrike.deploy(phosR.target, phosW.target, owner.address);

    Fertilizer = await ethers.getContractFactory("Fertilizer");
    fertilizer = await Fertilizer.deploy(phosW.target, phosR.target, owner.address);

    ATP = await ethers.getContractFactory("ATP");
    atp = await ATP.deploy(phosW.target, owner.address);

    DNA = await ethers.getContractFactory("DNA");
    dna = await DNA.deploy(phosW.target, owner.address);

    AcidBoost = await ethers.getContractFactory("AcidBoost");
    acidBoost = await AcidBoost.deploy(phosW.target, matchstrike.target, owner.address);

    await phosW.setApprovedBondingContract(fertilizer.target, true);
    await phosW.setApprovedBondingContract(dna.target, true);
    await phosW.setApprovedBondingContract(acidBoost.target, true);

    await phosR.grantMinterRole(fertilizer.target);
    await phosW.grantMinterRole(matchstrike.target);
  });

  describe("PHOS_W Decay", function () {
    it("Should decay the balance of an account over time", async function () {
      await phosW.mint(addr1.address, 1000);
      await network.provider.send("evm_increaseTime", [24 * 60 * 60]);
      await network.provider.send("evm_mine");

      const balance = await phosW.balanceOf(addr1.address);
      expect(balance).to.be.below(1000);
    });
  });

  describe("Matchstrike", function () {
    it("Should allow a user to stake PHOS-R and claim PHOS-W rewards", async function () {
      await phosR.mint(addr1.address, 100);
      await phosR.connect(addr1).approve(matchstrike.target, 100);
      await matchstrike.connect(addr1).stake(100);

      await network.provider.send("evm_increaseTime", [24 * 60 * 60]);
      await network.provider.send("evm_mine");

      await matchstrike.connect(addr1).claimRewards();
      const balance = await phosW.balanceOf(addr1.address);
      expect(balance).to.be.above(0);
    });
  });

  describe("Fertilizer", function () {
    it("Should allow a user to bond PHOS-W and claim PHOS-R rewards", async function () {
      await phosW.mint(addr1.address, 100);
      await phosW.connect(addr1).approve(fertilizer.target, 100);
      await fertilizer.connect(addr1).bond(100);

      await network.provider.send("evm_increaseTime", [24 * 60 * 60]);
      await network.provider.send("evm_mine");

      await phosR.mint(fertilizer.target, 1000); // Simulate rewards

      await fertilizer.connect(addr1).claimPhosRRewards();
      const balance = await phosR.balanceOf(addr1.address);
      expect(balance).to.be.above(0);
    });
  });

  describe("AcidBoost", function () {
    it("Should allow a user to burn PHOS-W to boost their staking rewards", async function () {
        await phosR.mint(addr1.address, 100);
        await phosR.connect(addr1).approve(matchstrike.target, 100);
        await matchstrike.connect(addr1).stake(100);

        await phosW.mint(addr1.address, 10);
        await phosW.connect(addr1).approve(acidBoost.target, 10);
        await acidBoost.connect(addr1).applyBoost(10, 2, 60 * 60);

        await network.provider.send("evm_increaseTime", [24 * 60 * 60]);
        await network.provider.send("evm_mine");

        await matchstrike.connect(addr1).claimRewards();
        const balance = await phosW.balanceOf(addr1.address);
        expect(balance).to.be.above(0);
    });
    });
});
