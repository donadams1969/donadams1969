import qrcode

print("Generating QR code...")

img = qrcode.make("d9a101...")
img.save("qr.png")

print("QR code generated.")
