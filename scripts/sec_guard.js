
// scripts/sec_guard.js
// ValorAiAegis+ Tokenomics Guard — fails fast on brand, NOTARY_ID, and tokenlist sanity.
const fs = require('fs');
const path = require('path');

function readJSON(p){ return JSON.parse(fs.readFileSync(p, 'utf8')); }

function fail(msg){
  console.error("Aegis SEC Guard:", msg);
  process.exit(17);
}

(function main(){
  const NOTARY = process.env.NOTARY_ID || "VALORAIPLUS";
  if (NOTARY !== "VALORAIPLUS"){
    fail(`NOTARY_ID must be VALORAIPLUS (got: ${NOTARY})`);
  }

  // tokenlist is optional pre-deploy; if present, enforce policy
  const tlPath = path.join(process.cwd(), 'tokenlist.json');
  if (fs.existsSync(tlPath)){
    const tl = readJSON(tlPath);
    if (!tl.name || !/VALOR\\s*AI\\+/i.test(tl.name)) fail("tokenlist.name must reference VALOR AI+");
    if (!Array.isArray(tl.tokens) || tl.tokens.length === 0) fail("tokenlist.tokens empty");
    const t = tl.tokens[0];
    if (!/^VAL/.test(String(t.symbol || ''))) fail("token symbol must start with 'VAL'");
    if (parseInt(String(t.decimals || 0), 10) !== 18) fail("token decimals must be 18");
    if (!t.address || !/^0x[0-9a-fA-F]{40}$/.test(t.address)) fail("token address missing/invalid");
  }

  // Brand files must exist
  const logo = path.join('assets', 'brand', 'valor_ai_plus_logo.svg');
  if (!fs.existsSync(logo)) fail("brand logo missing: " + logo);

  // Alias ban: if any source contains 'ValorToken', fail immediately
  const walk = (d)=>fs.readdirSync(d, {withFileTypes:true}).flatMap(ent=>{
    if (ent.name === 'node_modules' || ent.name.startsWith('.')) return [];
    const p = path.join(d, ent.name);
    return ent.isDirectory() ? walk(p) : [p];
  });
  const hits = [];
  for (const f of walk(process.cwd())){
    if (!/\\.(sol|js|ts|json|md)$/i.test(f)) continue;
    const txt = fs.readFileSync(f, 'utf8');
    if (/\\bValorToken\\b/.test(txt)) hits.push(f);
  }
  if (hits.length) fail("banned alias 'ValorToken' found in: " + hits.join(', '));

  console.log("Aegis SEC Guard: OK");
})();
