const { task } = require("hardhat/config");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

function readJSON(p){ return JSON.parse(fs.readFileSync(p, 'utf8')); }
function writeJSON(p, obj){ fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(obj, null, 2)); }

async function runNodeScript(scriptPath, args = []){
  const { spawn } = require('child_process');
  return new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, [scriptPath, ...args], { stdio: 'inherit' });
    proc.on('exit', code => code === 0 ? resolve() : reject(new Error(`${scriptPath} exited with ${code}`)));
  });
}

task("deployAndPin", "Deploy ERC20, emit tokenlist, notarize receipts, pin to IPFS, post CIDs (Aegis-guarded)")
  .addOptionalParam("name", "Token name", "Valor AI+ Token")
  .addOptionalParam("symbol", "Token symbol", "VALX")
  .addOptionalParam("supply", "Initial supply (human units)", "1000000000")
  .addOptionalParam("decimals", "Decimals", "18")
  .addOptionalParam("logo", "Path to logo asset", process.env.TOKEN_LOGO || "assets/brand/valor_ai_plus_logo.svg")
  .setAction(async (args, hre) => {
    // Aegis guard
    try {
      await runNodeScript(path.join("scripts","guard_predeploy.js"));
    } catch(e) {
      console.error("Predeploy guard failed:", e.message);
      throw e;
    }

    const { ethers, network } = hre;
    const [deployer] = await ethers.getSigners();

    console.log("\n==========================");
    console.log("  VALOR AI+: Deploy & Pin");
    console.log("==========================\n");
    console.log("Network:", network.name);
    console.log("Deployer:", deployer.address);

    const decimals = parseInt(args.decimals, 10);
    const humanSupply = args.supply;
    const supplyWei = ethers.parseUnits(humanSupply, decimals);

    // 1) Deploy
    const Factory = await ethers.getContractFactory("ValorAiPlusToken");
    const token = await Factory.deploy(args.name, args.symbol, supplyWei);
    const receipt = await token.deploymentTransaction().wait();

    console.log(`Deployed ${args.name} (${args.symbol}) at`, await token.getAddress());
    console.log("Tx hash:", receipt.hash);

    // 2) Save deployment + eth receipt
    const deployDir = path.join("deployments");
    const receiptsDir = path.join("receipts");
    fs.mkdirSync(deployDir, { recursive: true });
    fs.mkdirSync(receiptsDir, { recursive: true });

    const deployment = {
      network: network.name,
      address: await token.getAddress(),
      deployer: deployer.address,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      timestamp: Date.now()
    };
    const deploymentPath = path.join(deployDir, `${network.name}.json`);
    writeJSON(deploymentPath, deployment);

    const ethReceipt = {
      type: "ETH",
      network: network.name,
      txid: receipt.hash,
      blockNumber: receipt.blockNumber,
      contract: await token.getAddress()
    };
    writeJSON(path.join(receiptsDir, "eth_receipt.json"), ethReceipt);

    // 3) Emit tokenlist.json
    await runNodeScript(path.join("scripts", "emit_tokenlist.js"));

    // 4) Notarize to produce receipts/receipt.json (CustodyRoot)
    await runNodeScript(path.join("scripts", "notarize.js"));

    // 5) Pin tokenlist + receipt (+ logo if present)
    const pinArgs = ["tokenlist.json", path.join("receipts", "receipt.json")];
    if (args.logo && fs.existsSync(args.logo)) pinArgs.push(args.logo);
    await runNodeScript(path.join("scripts", "pin.js"), pinArgs);

    // 6) Collect latest pin report and send to case-manager
    const report = readJSON(path.join("receipts", "pinning_report.json"));
    const payload = {
      brand: "VALOR AI+",
      action: "deployAndPin",
      network: network.name,
      deployment,
      cids: report.cids,
      timestamp: new Date().toISOString()
    };
    fs.mkdirSync("case-manager", { recursive: true });
    writeJSON(path.join("case-manager", "ingest_cids.json"), payload);

    const hook = process.env.CASE_MANAGER_WEBHOOK;
    if (hook) {
      try {
        await axios.post(hook, payload, { timeout: 10000 });
        console.log("Posted CIDs to case-manager webhook.");
      } catch (e) {
        console.warn("Failed to POST to case-manager webhook:", e.message);
      }
    }

    console.log("\n✅ Done. tokenlist.json, custody receipt, and assets pinned. CIDs written to case-manager/ingest_cids.json");
  });
