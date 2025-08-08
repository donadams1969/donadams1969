#!/usr/bin/env python3
# pip install qrcode[pil]
import qrcode, sys, json
manifest = sys.argv[1]  # downloads/yourfile.json
j = json.load(open(manifest))
u = j["mirrors"][0]
png = manifest.replace(".json", ".qr.png")
img = qrcode.make(u)
img.save(png)
print("QR:", png)

sha = j["sha256"][:12]
svg_path = manifest.replace(".json", ".badge.svg")
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="180" height="20"><rect width="180" height="20" fill="#222"/><text x="8" y="14" fill="#fff" font-family="monospace" font-size="12">SHA256:{sha}</text></svg>'
open(svg_path, "w").write(svg)
print("Badge:", svg_path)
