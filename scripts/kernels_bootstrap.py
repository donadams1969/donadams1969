# ===============================================================
# VALORCHAIN™ © ® — Property of That's Edutainment LLC (California, USA)
# Veteran-Owned, Disabled-Veteran Company — All Rights Reserved.
# Redistribution or use requires explicit written permission.
# ===============================================================
"""
Fetch or verify SPICE kernels for ephemeris runs from Skrollkeeper mirror(s).

Env:
  SPK_BASEURL = https://www.skrollkeeper.org/kernels,https://backup.example.com/kernels
  SPK_DIR     = ./kernels
  SPK_LIST    = de440.bsp,naif0012.tls
  SPK_AUDIT_LOG = ./kernels_audit.log
Flags:
  --dry-run: Preview actions without downloading
"""

import os, hashlib, urllib.request, requests, sys, logging

SPK_DIR = os.environ.get("SPK_DIR", "kernels")
os.makedirs(SPK_DIR, exist_ok=True)

SPK_BASEURLS = (os.environ.get("SPK_BASEURL", "https://skrollkeeper.org/kernels")).split(",")
KERNELS = (os.environ.get("SPK_LIST") or "de440.bsp,naif0012.tls").split(",")
AUDIT_LOG = os.environ.get("SPK_AUDIT_LOG", "kernels_audit.log")

logging.basicConfig(filename=AUDIT_LOG, level=logging.INFO, format="%(asctime)s %(message)s")

dry_run = "--dry-run" in sys.argv

def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1<<20), b""):
            h.update(chunk)
    return h.hexdigest()

def validate_url(url):
    try:
        r = requests.head(url)
        return r.status_code == 200
    except:
        return False

def fetch(name, baseurls):
    out = os.path.join(SPK_DIR, name)
    if os.path.exists(out):
        sha = sha256(out)[:12]
        print(f"[kernels] present: {out} (sha256 {sha}...)")
        logging.info(f"Present: {out} (sha256 {sha}...)")
        return out

    for baseurl in baseurls:
        url = f"{baseurl.rstrip('/')}/{name}"
        if validate_url(url):
            if dry_run:
                print(f"[kernels] [dry-run] would download {name} from {url}")
                logging.info(f"[dry-run] Would download: {name} from {url}")
                return None
            print(f"[kernels] downloading {name} from {url}")
            urllib.request.urlretrieve(url, out)
            sha = sha256(out)[:12]
            print(f"[kernels] ok: {out} (sha256 {sha}...)")
            logging.info(f"Downloaded: {out} from {url} (sha256 {sha}...)")
            return out
        else:
            print(f"[kernels] WARN: {url} not found (skipping to next mirror)")
            logging.warning(f"Missing: {url}")

    raise ValueError(f"No valid mirror for {name}")

def main():
    ok = []
    for k in KERNELS:
        k = k.strip()
        if not k:
            continue
        try:
            res = fetch(k, SPK_BASEURLS)
            if res:
                ok.append(res)
        except Exception as e:
            print(f"[kernels] ERROR: {k} across mirrors: {e}")
            logging.error(f"Failed: {k} - {e}")
    print("\n[kernels] ready set:")
    for p in ok:
        print(" -", p)

if __name__ == "__main__":
    main()
