const hre = require("hardhat");

async function main() {
  const ValorAiSentinel = await hre.ethers.getContractFactory("ValorAiSentinel");
  const contract = await ValorAiSentinel.deploy();

  await contract.deployed();

  console.log(
    `ValorAiSentinel deployed to ${contract.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
