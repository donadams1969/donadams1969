#!/usr/bin/env python3
import argparse, base64, hashlib, json
from nacl.signing import SigningKey, VerifyKey
from nacl.exceptions import BadSignatureError

def sha256_file(path):
    return hashlib.sha256(open(path,'rb').read()).hexdigest()

def cmd_sign(args):
    sk = SigningKey(open(args.priv,'rb').read())
    data = open(args.file,'rb').read()
    sig = sk.sign(data).signature
    with open(args.out,'w') as f:
        json.dump({
            'sha256': sha256_file(args.file),
            'signature_b64': base64.b64encode(sig).decode()
        }, f, separators=(',',':'), sort_keys=True)

def cmd_verify(args):
    vk = VerifyKey(open(args.pub,'rb').read())
    data = open(args.file,'rb').read()
    sigdoc = json.load(open(args.sig))
    try:
        vk.verify(data, base64.b64decode(sigdoc['signature_b64']))
    except BadSignatureError:
        raise SystemExit('BAD SIGNATURE')
    if sha256_file(args.file) != sigdoc['sha256']:
        raise SystemExit('SHA256 mismatch')

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    sp = sub.add_parser('sign')
    sp.add_argument('--priv', required=True)
    sp.add_argument('--file', required=True)
    sp.add_argument('--out', required=True)
    sp.set_defaults(func=cmd_sign)
    vp = sub.add_parser('verify')
    vp.add_argument('--pub', required=True)
    vp.add_argument('--file', required=True)
    vp.add_argument('--sig', required=True)
    vp.set_defaults(func=cmd_verify)
    args = ap.parse_args()
    args.func(args)
