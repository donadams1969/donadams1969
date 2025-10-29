
// scripts/guard_predeploy.js
const { spawnSync } = require('child_process');

function run(cmd, args){
  const r = spawnSync(cmd, args, { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status || 1);
}
run('node', ['legal/sentinel_scan.js', '--strict']);
run('node', ['scripts/sec_guard.js']);
console.log('Predeploy guards passed.');
