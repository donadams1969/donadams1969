# valor_pdf_writer.py
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from datetime import datetime
import os
import hashlib

def write_anchor_pdf(merkle_hash, btc_txid, eth_txids=None, network="mainnet", out_dir="data/audit/anchors"):
    os.makedirs(out_dir, exist_ok=True)
    timestamp = datetime.utcnow().strftime("%Y-%m-%dT%H-%M-%SZ")
    filename = f"{out_dir}/VALORCHAIN_ANCHOR_{timestamp}.pdf"

    c = canvas.Canvas(filename, pagesize=letter)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, 750, "VALORCHAIN™️ OP_RETURN ANCHOR RECORD")
    c.setFont("Helvetica", 12)
    c.drawString(50, 710, f"Timestamp (UTC): {timestamp}")
    c.drawString(50, 690, f"Network: {network}")
    c.drawString(50, 670, f"Merkle Root: {merkle_hash}")
    c.drawString(50, 650, f"BTC TXID: {btc_txid}")

    if eth_txids:
        y = 630
        c.setFont("Helvetica", 10)
        for merkle, txid in eth_txids.items():
            c.drawString(50, y, f"{merkle}: {txid}")
            y -= 15

    c.line(50, y - 10, 560, y - 10)
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(50, y - 30, "Anchored within VALOR Ai+ Sovereign Cloud Capsule.")
    c.drawString(50, y - 45, "© VALORAIPLUS® 2025 — All Rights Reserved.")
    c.save()

    with open(filename, "rb") as f:
        pdf_hash = hashlib.sha3_512(f.read()).hexdigest()
    return filename, pdf_hash