// scripts/deploy_gillbtc.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying GILLBTC with the account:", deployer.address);

  // Get the ContractFactory for GILLBTC
  const GILLBTC = await ethers.getContractFactory("GILLBTC");

  // Deploy the contract, passing the deployer's address as the initial owner
  const gillbtc = await GILLBTC.deploy(deployer.address);

  // Wait for the deployment to be confirmed
  await gillbtc.deployed();

  console.log("GILLBTC deployed to:", gillbtc.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
