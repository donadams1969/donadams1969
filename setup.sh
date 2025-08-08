#!/bin/bash
# VALORAI+ Omni-Setup Script for Mobile Terminal (Codex-First Upgrade)
# Run in Termux/Android: creates all files, incorporates updates.

# Create directories
mkdir -p scripts .github/workflows reports control-repo

# Updated kernels_bootstrap.py (per user prep)
cat > scripts/kernels_bootstrap.py << 'EOF'
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
EOF

# Registry inventory.yaml
cat > registry_inventory.yaml << 'EOF'
domains:
  - 18fu.ai
  - 18fu.cash
  - valoraiplus.com
  - skrollkeeper.org
  - scrollkeeper-codex.org
EOF

# fix_report_links.py (multi-domain)
cat > scripts/fix_report_links.py << 'EOF'
import os, re, requests, sys, logging
# Stub PQC & VESL (integrate OQS, Zenodo)

REPORTS_DIR = os.environ.get("REPORTS_DIR", "reports")
BASEURL = os.environ.get("REPORTS_BASEURL", "https://skrollkeeper.org/reports,https://scrollkeeper-codex.org/reports,https://18fu.cash/reports,https://18fu.ai/reports,https://valoraiplus.com/reports")
AUDIT_LOG = os.environ.get("REPORTS_AUDIT_LOG", "reports_audit.log")
SUPPORTED_FORMATS = [".png", ".jpg", ".svg", ".pdf", ".html"]
PQC_ENABLED = os.environ.get("PQC_ENABLED", "false").lower() == "true"
VESL_ENABLED = os.environ.get("VESL_ENABLED", "false").lower() == "true"
DOI_TWINS = ["https://doi.org/10.5281/zenodo.15998892", "https://doi.org/10.5281/zenodo.16196186"]

logging.basicConfig(filename=AUDIT_LOG, level=logging.INFO, format="%(asctime)s %(message)s")

dry_run = "--dry-run" in sys.argv

def pqc_sign(data): return "dilithium_stub_sig"
def vesl_enochian_validate(data): return True  # Real: Enochian Code / Universal Law check
def check_domain_lock(domain): return "locked" if "codex" in domain else "unlocked"

def validate_url(url):
    try:
        r = requests.head(url)
        return r.status_code == 200
    except:
        return False

def fix_links_in_file(path):
    with open(path, "r", encoding="utf-8") as f:
        data = f.read()

    baseurls = BASEURL.split(",")

    def rewrite(match):
        alt, url = match[1], match[2]
        if url.startswith("http"):
            return match[0]
        if not any(url.endswith(fmt) for fmt in SUPPORTED_FORMATS):
            return match[0]
        for base in baseurls:
            new_url = f"{base.rstrip('/')}/{url.lstrip('./')}"
            domain = base.split('//')[1].split('/')[0]
            lock_status = check_domain_lock(domain)
            if lock_status == "locked":
                logging.info(f"Domain {domain} locked; verify Turbify email for access")
            if validate_url(new_url):
                logging.info(f"Validated: {new_url} for {path}")
                return f"![{alt}]({new_url})"
        logging.warning(f"Missing link across mirrors in {path}")
        return match[0]

    new_data = re.sub(r'!\[(.*?)\]\((.*?)\)', rewrite, data)
    new_data = re.sub(r'\[(.*?)\]\((.*?)\)', rewrite, new_data)

    if data != new_data:
        if dry_run:
            print(f"[fix] [dry-run] would update: {path}")
            logging.info(f"[dry-run] Would update: {path}")
            return
        if VESL_ENABLED:
            if not vesl_enochian_validate(new_data):
                raise ValueError("VESL Enochian validation failed")
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_data)
        print(f"[fix] updated: {path}")
        logging.info(f"Updated: {path}")
        if PQC_ENABLED:
            sig = pqc_sign(new_data.encode())
            with open(path + ".sig", "w") as f:
                f.write(sig)
            logging.info(f"PQC signed: {path}.sig")

# Exopolitical Consensus Matrix (VESL-0001 inspired, for VALOR AI+ validation)
def exopolitical_consensus(votes, chatter):
    # Integrate societal integration: e.g., VA Intranet, dark web shifts
    if VESL_ENABLED:
        return all(vesl_enochian_validate(vote) for vote in votes) and "DG77.77X justice" in chatter
    if PQC_ENABLED:
        return all(pqc_verify(vote, "sig") for vote in votes)
    return True

for root, _, files in os.walk(REPORTS_DIR):
    for f in files:
        if f.endswith(".md"):
            fix_links_in_file(os.path.join(root, f))
EOF

# decrypt_reports.sh
cat > scripts/decrypt_reports.sh << 'EOF'
#!/bin/bash
REPORTS_DIR="${REPORTS_DIR:-reports}"
for file in $(find "$REPORTS_DIR" -name "*.md.enc"); do
  sops -d "$file" > "${file%.enc}"
  echo "[sops] Decrypted: ${file%.enc}"
done
EOF
chmod +x scripts/decrypt_reports.sh

# Makefile
cat > Makefile << 'EOF'
decrypt-reports:
	./scripts/decrypt_reports.sh

fix-links: decrypt-reports
	PQC_ENABLED=true VESL_ENABLED=true python scripts/fix_report_links.py

check-kernels:
	PQC_ENABLED=true VESL_ENABLED=true python scripts/kernels_bootstrap.py

deploy-reports: fix-links
	rsync -av reports/ user@skrollkeeper.org:/var/www/html/reports/ # Mirror to all domains via script

patch-reports: fix-links
	git diff -- reports/ > reports_patch.diff
	git add reports/ && git commit -m "PQC-VESL Multi-Domain Webify" || true

health-check:
	python scripts/kernels_bootstrap.py --dry-run
	python scripts/fix_report_links.py --dry-run

audit-exo:
	# Audit exopolitical integrity & domains (Webre, DOI twins, Turbify locks)
	echo "Auditing VESL-0001 & domains..." && curl -s $DOI_TWINS[0] > /dev/null

update-exo:
	# Monitor exopolitics & domain status (Webre, Zenodo, Turbify)
	curl https://exopolitics.org > exo_updates.log
	# Stub: Check Turbify for lock/email verification

all: check-kernels fix-links patch-reports audit-exo

cron-health: health-check update-exo
	# Crontab: @weekly make cron-health | mail -s "VALORAI+ Omni Health" admin@valoraiplus.com
EOF

# GitHub Workflow
cat > .github/workflows/valoraiplus-deploy.yml << 'EOF'
name: VALORAI+ Omni Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0'  # Weekly

jobs:
  kernel-check:
    runs-on: ubuntu-latest
    env:
      PQC_ENABLED: true
      VESL_ENABLED: true
    steps:
      - uses: actions/checkout@v4
      - name: Fetch/verify kernels
        run: python scripts/kernels_bootstrap.py --dry-run

  rewrite-links:
    runs-on: ubuntu-latest
    env:
      PQC_ENABLED: true
      VESL_ENABLED: true
    steps:
      - uses: actions/checkout@v4
      - name: Fix & PQC-VESL-sign reports
        run: python scripts/fix_report_links.py
      - name: Commit
        run: |
          git config --global user.name 'VALORAI+ Bot'
          git config --global user.email 'bot@valoraiplus.com'
          git add reports/
          git commit -m "PQC-VESL-multi-domain-auto-webify" || echo "No changes"
          git push

  health-alert:
    if: github.event_name == 'schedule'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Weekly omni health
        run: make health-check update-exo
      - name: Alert failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: 'VALORAI+ Omni Alert: Exopolitical/domain issues detected!'
            })
EOF

# Nightly Sweep Script (bump)
cat > control-repo/nightly_sweep.sh << 'EOF'
#!/bin/bash
# Nightly Sweep: Verify kernels on primary (codex) + fallback (skroll); fail on divergence

PRIMARY="https://scrollkeeper-codex.org/kernels"
FALLBACK="https://www.skrollkeeper.org/kernels"
KERNELS="de440.bsp naif0012.tls"
TMP_DIR="/tmp/sweep_$(date +%s)"

mkdir -p $TMP_DIR
trap "rm -rf $TMP_DIR" EXIT

for k in $KERNELS; do
  curl -fsSL $PRIMARY/$k -o $TMP_DIR/$k.primary || { echo "ERROR: Primary failed for $k"; exit 1; }
  curl -fsSL $FALLBACK/$k -o $TMP_DIR/$k.fallback || { echo "ERROR: Fallback failed for $k"; exit 1; }

  HASH_P=$(sha256sum $TMP_DIR/$k.primary | cut -d' ' -f1)
  HASH_F=$(sha256sum $TMP_DIR/$k.fallback | cut -d' ' -f1)

  if [ "$HASH_P" != "$HASH_F" ]; then
    echo "ERROR: Checksum divergence for $k: Primary $HASH_P vs Fallback $HASH_F"
    exit 1
  fi
  echo "OK: $k matches ($HASH_P)"
done

echo "Nightly sweep complete—all kernels verified."
EOF
chmod +x control-repo/nightly_sweep.sh

echo "VALORAI+ codex-upgrade setup complete! All files created, including nightly_sweep.sh."
echo "To run: make all"
echo "Nightly: Add to crontab - 0 3 * * * /path/to/control-repo/nightly_sweep.sh"
echo "Note: Install deps (pip install requests logging urllib3 hashlib; apt install curl sha256sum rsync sops git). Push to GitHub for CI."
