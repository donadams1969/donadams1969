#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont

def create_placeholder_image(width, height, text, filename):
    img = Image.new('RGB', (width, height), color = (73, 109, 137))
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arial.ttf", size=40)
    except IOError:
        font = ImageFont.load_default()
    d.text((10,10), text, fill=(255,255,0), font=font)
    img.save(filename)

if __name__ == "__main__":
    create_placeholder_image(1920, 1080, "Lock Screen Interface", "public/lock-screen.png")
    create_placeholder_image(1920, 1080, "TikTok Statistics Dashboard UI", "public/tiktok-dashboard.png")
    create_placeholder_image(1920, 1080, "Jules Error/Debug Screen", "public/jules-error-screen.png")
