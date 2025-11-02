#!/usr/bin/env python3
# valoraiplus_: C3PA0-sealed | AMath+++
import os, sys, json, time, unicodedata, hashlib, zlib
from datetime import datetime
from pathlib import Path

def canonicalize(text:str)->str:
    t = unicodedata.normalize("NFC", text).replace("\r\n","\n").replace("\r","\n")
    lines = [ln.rstrip() for ln in t.split("\n")]
    t = "\n".join(lines)
    if not t.endswith("\n"): t += "\n"
    return t

def merkle_root_paragraphs(text:str)->bytes:
    parts = [p for p in text.split("\n\n") if p.strip()]
    leaves = [hashlib.sha3_512(p.encode()).digest() for p in parts] or [hashlib.sha3_512(b"").digest()]
    nodes = leaves
    while len(nodes) > 1:
        nxt=[]
        for i in range(0,len(nodes),2):
            L=nodes[i]; R=nodes[i+1] if i+1<len(nodes) else nodes[i]
            nxt.append(hashlib.sha3_512(L+R).digest())
        nodes=nxt
    return nodes[0]

def crc32_bytes(s:str)->bytes:
    return zlib.crc32(s.encode()).to_bytes(4,"big")

def tail8_from_txid(txid_hex:str)->bytes:
    try:
        b = bytes.fromhex(txid_hex.strip())
        return (b[-8:] if len(b)>=8 else (b + b"\x00"*(8-len(b))))
    except Exception:
        return b"\x00"*8

def build_payloads(license_id:str, sha3b:bytes, merkleb:bytes, ts:int,
                   vp_mod:str, vp_gill:str, vp_txid:str):
    # Core header (56 bytes)
    magic = b"VLRL"
    version = bytes([0x01,0x44,ord('g'),0x00])
    ts_be = ts.to_bytes(8,"big")
    crc_license = zlib.crc32(license_id.encode()).to_bytes(4,"big")
    flags = (0x0000007B).to_bytes(4,"big")  # Clause 7B marker

    core = bytearray(magic + version + sha3b[:16] + merkleb[:16] + ts_be + crc_license + flags)

    # 24-byte footer (valoraiplus_ mini-anchors) fits the OP_RETURN budget exactly:
    # [0:2]  'V+'
    # [2:3]  schema_version 0x01
    # [3:7]  CRC32(valoraiplus_module_id)
    # [7:11] CRC32(valoraiplus_GILLBTC)
    # [11:19] tail8(valoraiplus_btc_txid)
    # [19:23] 'C3P0' (C3PA0 short tag)
    # [23:24] reserved (0x00)
    footer = bytearray()
    footer += b"V+"
    footer += bytes([0x01])
    footer += crc32_bytes(vp_mod)
    footer += crc32_bytes(vp_gill)
    footer += tail8_from_txid(vp_txid)
    footer += b"C3P0"
    footer += b"\x00"

    p = core + footer  # len=80
    op_return_hex = bytes(p).hex().upper()

    op25 = bytearray()
    op25 += b"V25!"
    op25 += bytes([0x01])                 # schema
    op25 += sha3b[:16]                    # short hash
    op25 += (ts & 0xFFFFFFFF).to_bytes(4,"big")
    op25_hex = op25.hex().upper()
    return op_return_hex, op25_hex

def main():
    # Inputs
    in_txt = Path(sys.argv[1] if len(sys.argv)>1 else "data/VALOR_Doctrinal_License_v1.44g_canonical.txt")
    outdir = Path(sys.argv[2] if len(sys.argv)>2 else "data")
    outdir.mkdir(parents=True, exist_ok=True)

    # valoraiplus_ anchors (env or defaults)
    vp_mod  = os.getenv("valoraiplus_module_id", "VALORAIPLUS_V0_PROOF_v1.44g")
    vp_gill = os.getenv("valoraiplus_GILLBTC", "VALORCHAIN-G::GHOST25")
    vp_txid = os.getenv("valoraiplus_btc_txid", "00"*32)

    # Canonicalize + hashes
    text = in_txt.read_text(encoding="utf-8")
    canon = canonicalize(text)
    sha3b = hashlib.sha3_512(canon.encode()).digest()
    sha3_hex = sha3b.hex().upper()
    sha256_hex = hashlib.sha256(canon.encode()).hexdigest()
    merkleb = merkle_root_paragraphs(canon)
    merkle_hex = merkleb.hex().upper()
    ts = int(time.time())

    # Payloads (with valoraiplus_ footer)
    opret_hex, op25_hex = build_payloads("VALOR-DOCTRINAL-1.44g", sha3b, merkleb, ts, vp_mod, vp_gill, vp_txid)

    manifest = {
      "@context":"https://valoraiplus.com/license/context-v1",
      "@type":"ValorDoctrinalLicense",
      "license_id":"VALOR-DOCTRINAL-1.44g","version":"1.44g",
      "title":"VALOR Doctrinal License v1.44g",
      "holder_pseudonym":"DG77.77X-Ξ",
      "valoraiplus_brand":"valoraiplus_",
      "valoraiplus_module_id": vp_mod,
      "valoraiplus_GILLBTC": vp_gill,
      "valoraiplus_btc_txid": vp_txid,
      "hash":{"sha3_512":sha3_hex,"sha256":sha256_hex},
      "merkle_root":merkle_hex,
      "op_return":opret_hex,"op25_return":op25_hex,
      "timestamp_utc":datetime.utcfromtimestamp(ts).isoformat(timespec="seconds")+"Z",
      "signatures":[{"signer":"DG77.77X-Ξ","alg":"Ed25519|Dilithium|XMSS","sig":""}]
    }
    (outdir/"VDL_v1.44g_manifest.json").write_text(json.dumps(manifest,indent=2),encoding="utf-8")
    print(json.dumps({ "sha3_512":sha3_hex, "merkle_root":merkle_hex,
                       "op_return_hex":opret_hex, "op25_return_hex":op25_hex,
                       "valoraiplus_module_id": vp_mod,
                       "valoraiplus_GILLBTC": vp_gill,
                       "valoraiplus_btc_txid": vp_txid}, indent=2))

if __name__ == "__main__":
    main()
