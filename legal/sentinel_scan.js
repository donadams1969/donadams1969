// legal/sentinel_scan.js
// Scans the repo for banned strings and writes a report.
const fs = require('fs');
const path = require('path');

const banned = [/\bFALOR\b/i, /\bVALOR(?!\s*\s*AI\+)/i, /\bvalor_\b/i, /\bValorToken\b/];
const root = process.cwd();

function walk(dir){
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes:true })){
    if (ent.name.startsWith('.') || ent.name === 'node_modules') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const hits = [];
for (const f of walk(root)){
  try{
    const txt = fs.readFileSync(f, 'utf8');
    for (const re of banned){
      if (re.test(txt)){
        hits.push({ file: path.relative(root, f), rule: re.toString() });
      }
    }
  }catch{}
}

const outDir = path.join('legal', 'scans');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `sentinel_report_${Date.now()}.json`);
fs.writeFileSync(outPath, JSON.stringify({ timestamp: new Date().toISOString(), hits }, null, 2));
console.log("Sentinel scan written:", outPath, "hits:", hits.length);

// Strict mode: exit non-zero if hits found
if (process.argv.includes('--strict') && hits.length > 0) {
  console.error('Sentinel strict: banned terms detected:', hits);
  process.exit(13);
}
