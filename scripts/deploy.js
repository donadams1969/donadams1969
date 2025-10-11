const hre = require("hardhat");

async function main() {
  const ValorCaseRegistryV3 = await hre.ethers.getContractFactory("ValorCaseRegistryV3");
  const valorCaseRegistryV3 = await ValorCaseRegistryV3.deploy();
  await valorCaseRegistryV3.deployed();
  console.log("ValorCaseRegistryV3 deployed to:", valorCaseRegistryV3.address);

  const JAXX = await hre.ethers.getContractFactory("JAXX");
  const jaxx = await JAXX.deploy();
  await jaxx.deployed();
  console.log("JAXX deployed to:", jaxx.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });