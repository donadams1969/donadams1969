import os
import re

REPORTS_DIR = os.environ.get("REPORTS_DIR", "reports")
BASEURL = os.environ.get("REPORTS_BASEURL", "https://www.skrollkeeper.org/reports")

def fix_links_in_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    def repl(match):
        alt, url = match.group(1), match.group(2)
        if url.startswith("http"):
            return match.group(0)
        return f"![{alt}]({BASEURL.rstrip('/')}/{url.lstrip('./')})"
    content_new = re.sub(r'!\[(.*?)\]\(([^)]+)\)', repl, content)
    if content != content_new:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content_new)
        print(f"Rewrote links in {path}")

for root, _, files in os.walk(REPORTS_DIR):
    for file in files:
        if file.endswith(".md"):
            fix_links_in_file(os.path.join(root, file))
