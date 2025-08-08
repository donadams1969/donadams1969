# ===============================================================
# VALORCHAIN™ © ® — Property of That's Edutainment LLC (California, USA)
# Veteran-Owned, Disabled-Veteran Company — All Rights Reserved.
# Redistribution or use requires explicit written permission.
# ===============================================================
"""
Fetch or verify SPICE kernels for ephemeris runs from Skrollkeeper mirror.

Default:
  SPK_BASEURL = https://www.skrollkeeper.org/kernels
Env:
  SPK_DIR     = ./kernels
  SPK_LIST    = de440.bsp,naif0012.tls
"""

import os, hashlib, urllib.request

SPK_DIR = os.environ.get("SPK_DIR", "kernels")
os.makedirs(SPK_DIR, exist_ok=True)

SPK_BASEURL = os.environ.get("SPK_BASEURL", "https://www.skrollkeeper.org/kernels")
KERNELS = (os.environ.get("SPK_LIST") or "de440.bsp,naif0012.tls").split(",")

def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1<<20), b""):
            h.update(chunk)
    return h.hexdigest()

def fetch(name, baseurl):
    out = os.path.join(SPK_DIR, name)
    if os.path.exists(out):
        print(f"[kernels] present: {out} (sha256 {sha256(out)[:12]}...)")
        return out
    url = f"{baseurl.rstrip('/')}/{name}"
    print(f"[kernels] downloading {name} from {url}")
    urllib.request.urlretrieve(url, out)
    print(f"[kernels] ok: {out} (sha256 {sha256(out)[:12]}...)")
    return out

def main():
    ok = []
    for k in KERNELS:
        k = k.strip()
        if not k:
            continue
        try:
            ok.append(fetch(k, SPK_BASEURL))
        except Exception as e:
            print(f"[kernels] ERROR: failed to download {k} from {SPK_BASEURL}: {e}")
    print("\n[kernels] ready set:")
    for p in ok:
        print(" -", p)

if __name__ == "__main__":
    main()
