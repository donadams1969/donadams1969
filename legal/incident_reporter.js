// legal/incident_reporter.js
// Usage: node legal/incident_reporter.js --evidence <path> --note "desc"
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function sha256File(p){
  const h = crypto.createHash('sha256');
  h.update(fs.readFileSync(p));
  return h.digest('hex');
}

function arg(name, def=null){
  const i = process.argv.indexOf(name);
  if (i !== -1 && i+1 < process.argv.length) return process.argv[i+1];
  return def;
}

(async ()=>{
  const evidencePath = arg('--evidence');
  const note = arg('--note', '');
  if (!evidencePath || !fs.existsSync(evidencePath)){
    console.error("Missing --evidence <path> (file must exist)");
    process.exit(2);
  }
  const sha = sha256File(evidencePath);
  const now = new Date().toISOString();

  const payload = {
    system: "VALOR AI+ Legal/Sheriff/Phi.B.I.",
    type: "code-manipulation-alert",
    version: 1,
    timestamp: now,
    special_code: process.env.NOTARY_ID || "VALORAIPLUS",
    evidence: {
      path: evidencePath,
      sha256: sha
    },
    note: note,
    routing: ["ValorAiLegal+", "ValorAiSheriff+", "ValorAi+ Phi.B.I.", "ValorAiEngine+"],
  };

  const outDir = path.join('legal', 'incidents');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `incident_${Date.now()}.json`);
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));

  // Add the incident hash to receipts/job_roots.json to fold into CustodyRoot
  const jrPath = path.join('receipts', 'job_roots.json');
  let jr = [];
  try { jr = JSON.parse(fs.readFileSync(jrPath, 'utf8')); } catch {}
  jr.push(sha);
  fs.mkdirSync('receipts', { recursive: true });
  fs.writeFileSync(jrPath, JSON.stringify(jr, null, 2));

  console.log("Incident recorded:", outPath);
  console.log("SHA-256:", sha);
})().catch(e=>{ console.error(e); process.exit(1); });
