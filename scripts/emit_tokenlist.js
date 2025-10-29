const fs = require('fs');
const path = require('path');

function readJSON(p){ return JSON.parse(fs.readFileSync(p, 'utf8')); }

function main(){
  const networkFiles = fs.existsSync('deployments') ? fs.readdirSync('deployments') : [];
  if (networkFiles.length === 0){
    console.error("No deployments/* found. Run a deployment first.");
    process.exit(1);
  }
  // Use the most recent deployment file
  const latest = networkFiles.map(n=>({ n, t: fs.statSync(path.join('deployments', n)).mtimeMs }))
                             .sort((a,b)=>b.t - a.t)[0].n;
  const dep = readJSON(path.join('deployments', latest));
  const chainIdMap = { mainnet: 1, sepolia: 11155111, hardhat: 31337 };
  const chainId = chainIdMap[dep.network] || 0;

  const logoCIDPath = path.join('receipts', 'pinning_report.json');
  let logoURI = undefined;
  if (fs.existsSync(logoCIDPath)){
    try {
      const pinReport = readJSON(logoCIDPath);
      const found = (pinReport.cids || []).find(e => (e.path || '').includes('assets/brand/valor_ai_plus_logo.svg'));
      if (found && found.cid) logoURI = `ipfs://${found.cid}`;
    } catch {}
  }

  const tokenlist = {
    name: "VALOR AI+ Token List",
    timestamp: new Date().toISOString(),
    version: { major: 1, minor: 0, patch: 0 },
    keywords: ["VALOR", "VALOR AI+", "VALX"],
    tokens: [
      {
        chainId,
        address: dep.address,
        name: process.env.TOKEN_NAME || "Valor AI+ Token",
        symbol: process.env.TOKEN_SYMBOL || "VALX",
        decimals: parseInt(process.env.TOKEN_DECIMALS || "18", 10),
        logoURI: logoURI,
        tags: ["official"]
      }
    ]
  };

  fs.writeFileSync("tokenlist.json", JSON.stringify(tokenlist, null, 2));
  console.log("Wrote tokenlist.json");
}

main();
