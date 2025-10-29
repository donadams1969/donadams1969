
// scripts/loop.js
// ValorAiLoop+ — auto-notarize & pin receipts on changes
const fs = require('fs');
const { spawn } = require('child_process');

function run(nodeScript, args=[]){
  return new Promise((res, rej)=>{
    const p = spawn(process.execPath, [nodeScript, ...args], { stdio: 'inherit' });
    p.on('exit', c => c===0 ? res() : rej(new Error(nodeScript+" exit "+c)));
  });
}

let pending = false;
async function cycle(){
  if (pending) return;
  pending = true;
  try {
    await run('scripts/notarize.js', []);
    await run('scripts/pin.js', ['receipts/receipt.json']);
    console.log('ValorAiLoop+: cycle complete.');
  } catch(e){
    console.error('ValorAiLoop+ error:', e.message);
  } finally { pending = false; }
}

['receipts/eth_receipt.json','receipts/job_roots.json','receipts/sweep_root.txt']
  .forEach(f => fs.watch(f, {persistent:true}, cycle));

console.log('ValorAiLoop+ running. Watching receipts/*');
cycle();
