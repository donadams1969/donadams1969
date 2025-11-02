const hre = require("hardhat");

async function main() {
  const ValorCaseRegistryV3 = await hre.ethers.getContractFactory("ValorCaseRegistryV3");
  const valorCaseRegistryV3 = await ValorCaseRegistryV3.deploy();

  await valorCaseRegistryV3.deployed();

  console.log(
    `ValorCaseRegistryV3 deployed to ${valorCaseRegistryV3.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
