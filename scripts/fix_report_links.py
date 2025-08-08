import os, re, requests, sys, logging

REPORTS_DIR = os.environ.get("REPORTS_DIR", "reports")
BASEURL = os.environ.get("REPORTS_BASEURL", "https://skrollkeeper.org/reports")
AUDIT_LOG = os.environ.get("REPORTS_AUDIT_LOG", "reports_audit.log")
SUPPORTED_FORMATS = [".png", ".jpg", ".svg", ".pdf", ".html"]  # Quantum-extended

logging.basicConfig(filename=AUDIT_LOG, level=logging.INFO, format="%(asctime)s %(message)s")

dry_run = "--dry-run" in sys.argv

def validate_url(url):
    try:
        r = requests.head(url)
        return r.status_code == 200
    except:
        return False

def fix_links_in_file(path):
    with open(path, "r", encoding="utf-8") as f:
        data = f.read()

    def rewrite(match):
        alt, url = match[1], match[2]
        if url.startswith("http"):
            return match[0]
        if not any(url.endswith(fmt) for fmt in SUPPORTED_FORMATS):
            return match[0]  # Skip unsupported
        new_url = f"{BASEURL.rstrip('/')}/{url.lstrip('./')}"
        if validate_url(new_url):
            logging.info(f"Validated: {new_url} for {path}")
            return f"![{alt}]({new_url})"
        else:
            logging.warning(f"Missing: {new_url} in {path}")
            return match[0]  # Don't rewrite if missing

    new_data = re.sub(r'!\[(.*?)\]\((.*?)\)', rewrite, data)  # Images/figures
    new_data = re.sub(r'\[(.*?)\]\((.*?)\)', rewrite, new_data)  # Links (for embeds/PDFs)

    if data != new_data:
        if dry_run:
            print(f"[fix] [dry-run] would update: {path}")
            logging.info(f"[dry-run] Would update: {path}")
            return
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_data)
        print(f"[fix] updated: {path}")
        logging.info(f"Updated: {path}")

for root, _, files in os.walk(REPORTS_DIR):
    for f in files:
        if f.endswith(".md"):
            fix_links_in_file(os.path.join(root, f))
