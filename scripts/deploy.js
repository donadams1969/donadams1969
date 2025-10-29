const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main(){
  const { ethers, network } = hre;
  const [deployer] = await ethers.getSigners();
  const name = process.env.TOKEN_NAME || "Valor AI+ Token";
  const symbol = process.env.TOKEN_SYMBOL || "VALX";
  const decimals = parseInt(process.env.TOKEN_DECIMALS || "18", 10);
  const humanSupply = process.env.TOKEN_SUPPLY || "1000000000";
  const supplyWei = ethers.parseUnits(humanSupply, decimals);

  const Factory = await ethers.getContractFactory("ValorAiPlusToken");
  const token = await Factory.deploy(name, symbol, supplyWei);
  const receipt = await token.deploymentTransaction().wait();

  const deployment = {
    network: network.name,
    address: await token.getAddress(),
    deployer: deployer.address,
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    timestamp: Date.now()
  };

  const receiptsDir = path.join("receipts");
  const deployDir = path.join("deployments");
  fs.mkdirSync(receiptsDir, { recursive: true });
  fs.mkdirSync(deployDir, { recursive: true });
  fs.writeFileSync(path.join(deployDir, `${network.name}.json`), JSON.stringify(deployment, null, 2));

  const ethReceipt = {
    type: "ETH",
    network: network.name,
    txid: receipt.hash,
    blockNumber: receipt.blockNumber,
    contract: await token.getAddress()
  };
  fs.writeFileSync(path.join(receiptsDir, "eth_receipt.json"), JSON.stringify(ethReceipt, null, 2));

  console.log("Deployed", name, "at", await token.getAddress(), "tx:", receipt.hash);
}

main().catch((e)=>{ console.error(e); process.exit(1); });
