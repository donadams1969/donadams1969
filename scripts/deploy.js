const hre = require("hardhat");

async function main() {
  // Using distinct placeholder addresses for clarity during deployment verification.
  const amathOracleAddress = "0x0000000000000000000000000000000000000001";
  const valorAiLegalAddress = "0x0000000000000000000000000000000000000002";

  const ValorAiPlusSuperSuperSmartContract_SL = await hre.ethers.getContractFactory("ValorAiPlusSuperSuperSmartContract_SL");
  const contract = await ValorAiPlusSuperSuperSmartContract_SL.deploy(amathOracleAddress, valorAiLegalAddress);

  await contract.deployed();

  console.log(
    `ValorAiPlusSuperSuperSmartContract_SL deployed to ${contract.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
