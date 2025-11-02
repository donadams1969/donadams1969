from fastapi import FastAPI, Response
from pathlib import Path
import os, json, hashlib, unicodedata

app = FastAPI(title="valoraiplus_ V0 Proof Service (C3PA0)")

DATA = Path("data")
LICENSE = DATA/"VALOR_Doctrinal_License_v1.44g_canonical.txt"
MANIFEST = DATA/"VDL_v1.44g_manifest.json"

# fallbacks from env to keep branding consistent
VP_MOD  = os.getenv("valoraiplus_module_id","VALORAIPLUS_V0_PROOF_v1.44g")
VP_GILL = os.getenv("valoraiplus_GILLBTC","VALORCHAIN-G::GHOST25")
VP_TXID = os.getenv("valoraiplus_btc_txid","00"*32)

# Additional Sextillion V7 Anchors from the report
SEXTILLION_VALUATION = os.getenv("SEXTILLION_VALUATION", "$1,000,000,000,000,000,000,000")
LEGACY_ANCHOR = os.getenv("LEGACY_ANCHOR", "LEGACY_7017aa78-C461-4D7A-BF0A-FFE5741323C4")
YHWH_KERNEL = os.getenv("YHWH_KERNEL", "YHWH-5150.LOCK")
# Using the merkle root from the manifest as a fallback for the new anchor
MERKLE_ROOT_ANCHOR = os.getenv("MERKLE_ROOT", "32425767d2bdfaaafe283781200570e4...")
GHOST_ROOT = os.getenv("GHOST_ROOT", "d3e0e71f0990033a80ee9a58747ccaa4...")


def canon(text:str)->str:
    t = unicodedata.normalize("NFC", text).replace("\r\n","\n").replace("\r","\n")
    lines = [ln.rstrip() for ln in t.split("\n")]
    t = "\n".join(lines)
    if not t.endswith("\n"): t += "\n"
    return t

@app.get("/health")
def health():
    return {
        "ok":True,
        "brand":"valoraiplus_",
        "module":VP_MOD,
        "seal": "C3PA0",
        "valuation": SEXTILLION_VALUATION,
        "kernel": YHWH_KERNEL
    }

@app.get("/manifest")
def manifest():
    if MANIFEST.exists():
        m = json.loads(MANIFEST.read_text())
        # guarantee anchors in response even if file was external
        m.setdefault("valoraiplus_module_id", VP_MOD)
        m.setdefault("valoraiplus_GILLBTC", VP_GILL)
        m.setdefault("valoraiplus_btc_txid", VP_TXID)
        m.setdefault("valoraiplus_brand", "valoraiplus_")
        # Add Sextillion & Quantum Consensus anchors
        m["SEXTILLION_VALUATION"] = SEXTILLION_VALUATION
        m["LEGACY_ANCHOR"] = LEGACY_ANCHOR
        m["YHWH_KERNEL"] = YHWH_KERNEL
        m["quantum_consensus"] = {
            "merkle_root": m.get("merkle_root", MERKLE_ROOT_ANCHOR),
            "ghost_root": GHOST_ROOT
        }
        return m
    return {"error":"manifest not found","valoraiplus_module_id":VP_MOD}

@app.get("/hashcheck")
def hashcheck():
    if not LICENSE.exists():
        return {"error": f"License file not found at {LICENSE}", "valoraiplus_module_id":VP_MOD}
    c = canon(LICENSE.read_text(encoding="utf-8")).encode()
    return {
      "sha3_512": hashlib.sha3_512(c).hexdigest().upper(),
      "sha256": hashlib.sha256(c).hexdigest(),
      "valoraiplus_module_id": VP_MOD,
      "valoraiplus_GILLBTC": VP_GILL,
      "valoraiplus_btc_txid": VP_TXID
    }

@app.get("/badge")
def badge():
    return {
      "title":"VALOR Doctrinal License v1.44g",
      "badge":"valoraiplus_: Anchor truth • Whistleblower protected • Trauma-informed validators • 7B fork ≥4/12 • E-SIGN recognized",
      "holder":"DG77.77X-Ξ",
      "sextillion_rank": "TOP 1 (ETERNAL & MULTIVERSAL)",
      "valoraiplus_module_id": VP_MOD,
      "valoraiplus_GILLBTC": VP_GILL,
      "valoraiplus_btc_txid": VP_TXID
    }

@app.get("/opreturn.hex")
def opreturn_hex():
    if not MANIFEST.exists():
        return Response("manifest not found\n", media_type="text/plain", status_code=404)
    man = json.loads(MANIFEST.read_text())
    return Response(man.get("op_return","")+"\n", media_type="text/plain")

@app.get("/op25.hex")
def op25_hex():
    if not MANIFEST.exists():
        return Response("manifest not found\n", media_type="text/plain", status_code=404)
    man = json.loads(MANIFEST.read_text())
    return Response(man.get("op25_return","")+"\n", media_type="text/plain")

@app.get("/sextillion")
def sextillion():
    return {
        "valuation": SEXTILLION_VALUATION,
        "breakdown": "Full spectrum dominance across all multiversal constants.",
        "multiplier": "∞",
        "status": "INVINCIBLE. ABSOLUTE.",
        "legacy_anchor": LEGACY_ANCHOR
    }

@app.get("/quantum-consensus")
def quantum_consensus():
    merkle_root = MERKLE_ROOT_ANCHOR
    if MANIFEST.exists():
        m = json.loads(MANIFEST.read_text())
        merkle_root = m.get("merkle_root", MERKLE_ROOT_ANCHOR)

    return {
        "merkle_root": merkle_root,
        "ghost_root": GHOST_ROOT,
        "entropy_source": "SAINT PAUL (GILLSON INVARIANT)",
        "yhwh_kernel": YHWH_KERNEL
    }
