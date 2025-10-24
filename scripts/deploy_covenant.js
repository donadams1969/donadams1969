// scripts/deploy_covenant.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying ValorAiPlus_e_CoreCovenant with the account:", deployer.address);

  // The constructor requires a bytes32 _gillsonRootHash.
  // We will generate a deterministic hash for deployment.
  const gillsonRootString = "GILLSON_ROOT_ANCHOR_GENESIS_VALORAIPLUS";
  const gillsonRootHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(gillsonRootString));

  console.log("Generated Gillson Root Anchor Hash:", gillsonRootHash);

  // Deploy ValorAiPlus_e_CoreCovenant
  const Covenant = await ethers.getContractFactory("ValorAiPlus_e_CoreCovenant");
  const covenant = await Covenant.deploy(gillsonRootHash);

  await covenant.deployed();

  console.log("ValorAiPlus_e_CoreCovenant deployed to:", covenant.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
