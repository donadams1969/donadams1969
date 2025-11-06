#!/usr/bin/env python3
import argparse, base64, hashlib, json
from nacl.signing import SigningKey, VerifyKey
from nacl.exceptions import BadSignatureError


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sign(priv_path: str, file_path: str, out_path: str) -> None:
    sk = SigningKey(open(priv_path, "rb").read())
    data = open(file_path, "rb").read()
    sig = sk.sign(data).signature
    out = {
        "sha256": sha256(data),
        "signature_b64": base64.b64encode(sig).decode(),
    }
    open(out_path, "w").write(json.dumps(out, separators=(",", ":"), sort_keys=True))


def verify(pub_path: str, file_path: str, sig_path: str) -> None:
    vk = VerifyKey(open(pub_path, "rb").read())
    data = open(file_path, "rb").read()
    sigdoc = json.loads(open(sig_path).read())
    sig = base64.b64decode(sigdoc["signature_b64"])
    try:
        vk.verify(data, sig)
    except BadSignatureError:
        raise SystemExit("BAD SIGNATURE")
    if sha256(data) != sigdoc.get("sha256"):
        raise SystemExit("SHA256 mismatch")
    print("OK")


def main() -> None:
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("sign")
    s.add_argument("--priv", required=True)
    s.add_argument("--file", required=True)
    s.add_argument("--out", required=True)
    v = sub.add_parser("verify")
    v.add_argument("--pub", required=True)
    v.add_argument("--file", required=True)
    v.add_argument("--sig", required=True)
    args = p.parse_args()
    if args.cmd == "sign":
        sign(args.priv, args.file, args.out)
    else:
        verify(args.pub, args.file, args.sig)


if __name__ == "__main__":
    main()
