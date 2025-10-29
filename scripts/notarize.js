const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const NOTARY_ID = process.env.NOTARY_ID || "VALORAIPLUS";

function sha256Hex(s){
  return crypto.createHash('sha256').update(s).digest('hex');
}

function readMaybe(p){
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

function main(){
  const receiptsDir = path.join('receipts');
  const outPath = path.join(receiptsDir, 'receipt.json');
  fs.mkdirSync(receiptsDir, { recursive: true });

  const sweepRootPath = path.join(receiptsDir, 'sweep_root.txt');
  const jobRootsPath = path.join(receiptsDir, 'job_roots.json');

  const sweepRoot = fs.existsSync(sweepRootPath) ? fs.readFileSync(sweepRootPath, 'utf8').trim() : "";
  const jobRoots = fs.existsSync(jobRootsPath) ? JSON.parse(fs.readFileSync(jobRootsPath, 'utf8')) : [];

  const receipts = [];
  const eth = readMaybe(path.join(receiptsDir, 'eth_receipt.json'));
  const btc = readMaybe(path.join(receiptsDir, 'btc_receipt.json'));
  const valor = readMaybe(path.join(receiptsDir, 'valorchain_receipt.json'));
  if (eth) receipts.push(eth);
  if (btc) receipts.push(btc);
  if (valor) receipts.push(valor);

  // Build the union set {SweepRoot} ∪ {JobRoots} ∪ {Receipts}
  const elems = [];
  if (sweepRoot) elems.push(sweepRoot);
  for (const r of jobRoots) elems.push(String(r));
  for (const r of receipts) {
    if (r && r.txid) elems.push(String(r.txid));
  }

  // Deterministic order + domain separation with NOTARY_ID
  const uniqueSorted = Array.from(new Set(elems)).sort();
  const preimage = NOTARY_ID + "|" + uniqueSorted.join("|");
  const custodyRoot = sha256Hex(preimage);

  const out = {
    version: 1,
    notary_id: NOTARY_ID,
    created_at_utc: new Date().toISOString(),
    sweep_root: sweepRoot || null,
    job_roots: jobRoots,
    receipts: receipts,
    custody_root: custodyRoot,
    hash_function: "SHA-256",
    preimage_scheme: "sha256(NOTARY_ID || '|' || join(sorted(unique(set)), '|'))"
  };

  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log("Wrote", outPath);
}

main();
