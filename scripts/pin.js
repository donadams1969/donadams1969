const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

function parseEndpoints(){
  const raw = process.env.IPFS_API_URLS || "http://127.0.0.1:5001";
  return raw.split(',').map(s => s.trim()).filter(Boolean).map(u => {
    // normalize: allow base without /api/v0
    let base = u.replace(/\/$/, '');
    if (!base.endsWith('/api/v0')) base = base + '/api/v0';
    return base;
  });
}

async function pinFileTo(endpoint, filePath){
  const url = endpoint + "/add?pin=true&cid-version=1&raw-leaves=true";
  const fd = new FormData();
  fd.append('file', fs.createReadStream(filePath), { filepath: path.basename(filePath) });
  const res = await axios.post(url, fd, { headers: fd.getHeaders(), maxBodyLength: Infinity });
  // Kubo returns NDJSON when multiple files; for single it is usually an object
  const dataStr = typeof res.data === 'string' ? res.data.trim() : JSON.stringify(res.data);
  // Try to extract the last JSON object with Hash/Cid
  let cid = null;
  try{
    const lines = dataStr.split('\n').filter(Boolean);
    const last = JSON.parse(lines[lines.length - 1]);
    cid = (last.Hash || (last.Cid && (last.Cid['/'] || last.Cid)) || null);
  }catch(e){
    // fallback naive regex
    const m = dataStr.match(/["']Hash["']\s*:\s*["']([^"']+)["']/);
    if (m) cid = m[1];
  }
  if (!cid) throw new Error("Failed to parse CID from response: " + dataStr.slice(0,200));
  return cid;
}

async function main(){
  const args = process.argv.slice(2);
  if (args.length === 0){
    console.error("Usage: node scripts/pin.js <file1> <file2> ...");
    process.exit(1);
  }
  const endpoints = parseEndpoints();
  const out = { cids: [], endpoints: endpoints, time: new Date().toISOString() };

  for (const filePath of args){
    if (!fs.existsSync(filePath)) { console.warn("Skip missing:", filePath); continue; }
    for (const ep of endpoints){
      try{
        const cid = await pinFileTo(ep, filePath);
        out.cids.push({ endpoint: ep, path: filePath, cid });
        console.log(`Pinned ${filePath} to ${ep} → cid: ${cid}`);
      }catch(e){
        console.warn(`Failed to pin ${filePath} to ${ep}:`, e.message);
      }
    }
  }

  // Optional auto-pin receipt if env PIN_RECEIPT=1 and not already included
  if ((process.env.PIN_RECEIPT || "0") === "1"){
    const recPath = path.join("receipts", "receipt.json");
    if (fs.existsSync(recPath) && !out.cids.find(e => e.path === recPath)){
      for (const ep of endpoints){
        try{
          const cid = await pinFileTo(ep, recPath);
          out.cids.push({ endpoint: ep, path: recPath, cid });
          console.log(`(Auto) Pinned receipt to ${ep} → ${cid}`);
        }catch(e){
          console.warn("Auto-pin receipt failed:", e.message);
        }
      }
    }
  }

  fs.mkdirSync("receipts", { recursive: true });
  fs.writeFileSync(path.join("receipts", "pinning_report.json"), JSON.stringify(out, null, 2));
  console.log("Wrote receipts/pinning_report.json");
}

main();
