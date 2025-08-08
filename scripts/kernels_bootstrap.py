# ===============================================================
# VALORAI+™ © ® — Property of That's Edutainment LLC (California, USA)
# Veteran-Owned, Disabled-Veteran Company — All Rights Reserved.
# ===============================================================
import os, hashlib, urllib.request

SPK_DIR = os.environ.get("SPK_DIR", "kernels")
os.makedirs(SPK_DIR, exist_ok=True)

# Primary mirror (your domain); override with SPK_BASEURL if needed
PRIMARY  = os.environ.get("SPK_BASEURL", "https://scrollkeeper-codex.org/kernels")
FALLBACK = os.environ.get("SPK_FALLBACK", "https://www.skrollkeeper.org/kernels")
KERNELS  = (os.environ.get("SPK_LIST") or "de440.bsp,naif0012.tls").split(",")

def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1<<20), b""): h.update(chunk)
    return h.hexdigest()

def fetch_one(name, baseurl):
    url = f"{baseurl.rstrip('/')}/{name}"
    out = os.path.join(SPK_DIR, name)
    urllib.request.urlretrieve(url, out)
    print(f"[kernels] ok: {out}  sha256={sha256(out)[:12]}..  from {baseurl}")
    return out

def fetch(name):
    out = os.path.join(SPK_DIR, name)
    if os.path.exists(out):
        print(f"[kernels] present: {out}  sha256={sha256(out)[:12]}..")
        return out
    try:
        return fetch_one(name, PRIMARY)
    except Exception as e:
        print(f"[kernels] WARN primary failed ({PRIMARY}): {e}")
        return fetch_one(name, FALLBACK)

def main():
    ok = []
    for k in [x.strip() for x in KERNELS if x.strip()]:
        try: ok.append(fetch(k))
        except Exception as e: print(f"[kernels] ERROR: {k}: {e}")
    print("\n[kernels] ready:")
    for p in ok: print(" -", p)

if __name__ == "__main__":
    main()
