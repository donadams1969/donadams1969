const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the token
  const JAXX2025Token = await ethers.getContractFactory("JAXX2025Token");
  const jaxx2025Token = await JAXX2025Token.deploy(deployer.address);
  console.log("JAXX2025Token deployed to:", jaxx2025Token.address);

  // Read the genesis file
  const genesisPath = path.join(__dirname, "..", "..", "valorchain", "genesis.json");
  const genesis = JSON.parse(fs.readFileSync(genesisPath, "utf8"));

  // Get the allocation details
  const {
    ecosystemTreasury,
    foundingTeamAndAdvisors,
  } = genesis.allocations;

  // Vesting schedules in seconds
  const fiveYears = 5 * 365 * 24 * 60 * 60;
  const fourYears = 4 * 365 * 24 * 60 * 60;
  const oneYearCliff = 1 * 365 * 24 * 60 * 60;

  // Deploy vesting contract for the treasury
  const treasuryVestingWallet = await ethers.getContractFactory("VestingWallet");
  const treasuryVesting = await treasuryVestingWallet.deploy(
    ecosystemTreasury.address,
    Math.floor(Date.now() / 1000), // Start time (now)
    fiveYears
  );
  console.log("Treasury VestingWallet deployed to:", treasuryVesting.address);
  await jaxx2025Token.transfer(treasuryVesting.address, ecosystemTreasury.amount);
  console.log(`Transferred ${ecosystemTreasury.amount} tokens to the Treasury VestingWallet`);

  // Deploy vesting contract for the team
  const teamVestingWallet = await ethers.getContractFactory("VestingWallet");
  const teamVesting = await teamVestingWallet.deploy(
    foundingTeamAndAdvisors.address,
    Math.floor(Date.now() / 1000) + oneYearCliff, // Start time (1 year from now)
    fourYears
  );
  console.log("Team VestingWallet deployed to:", teamVesting.address);
  await jaxx2025Token.transfer(teamVesting.address, foundingTeamAndAdvisors.amount);
  console.log(`Transferred ${foundingTeamAndAdvisors.amount} tokens to the Team VestingWallet`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
