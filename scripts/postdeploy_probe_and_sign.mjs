import fs from 'fs';
import fetch from 'node-fetch';
import { sign } from '@noble/ed25519';

const [,,] = process.argv; // reserved

const receiptsDir = 'receipts';
fs.readdirSync(receiptsDir).forEach(async file => {
  const data = fs.readFileSync(`${receiptsDir}/${file}`);
  console.log(`Probing & signing ${file}...`);

  // Probe logic here (RPC calls) - omitted for brevity
  // ...

  // Sign with DID key
  const privKey = Buffer.from(process.env.DID_PRIVATE_KEY.replace(/^0x/, ''), 'hex');
  const sig = Buffer.from(await sign(data, privKey)).toString('hex');

  const signedReceipt = { receipt: JSON.parse(data), signature: `0x${sig}` };
  fs.writeFileSync(`${receiptsDir}/${file.replace('.json','-signed.json')}`, JSON.stringify(signedReceipt, null, 2));

  // Pin to IPFS (Pinata)
  if (process.env.PINATA_JWT) {
    const fd = new FormData();
    fd.append('file', Buffer.from(JSON.stringify(signedReceipt)), `${file.replace('.json','-signed.json')}`);
    await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.PINATA_JWT}` },
      body: fd
    }).then(r=>r.json()).then(j=>console.log(`Pinned: ${j.IpfsHash}`));
  }
});
