const hre = require("hardhat");

async function main() {
  const amathOracleAddress = "0x0000000000000000000000000000000000000000";

  const ValorAiPlusSuperSuperSmartContract = await hre.ethers.getContractFactory("ValorAiPlusSuperSuperSmartContract");
  const contract = await ValorAiPlusSuperSuperSmartContract.deploy(amathOracleAddress);

  await contract.deployed();

  console.log(
    `ValorAiPlusSuperSuperSmartContract deployed to ${contract.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
