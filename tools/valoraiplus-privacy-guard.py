import os
import re
import hashlib

# Define encrypted name placeholder
ENCRYPTED_NAME = "[ENCRYPTED_LEGAL_NAME]"

# Define paths to scan
paths_to_scan = ["."]

# Define files to ignore
ignore_files = [".git", ".github"]

def encrypt_name(match):
    # Encrypt name using SHA3-512
    name = match.group(0)
    encrypted = hashlib.sha3_512(name.encode()).hexdigest().upper()
    return f"[ENCRYPTED_{encrypted}]"

def scan_and_encrypt(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file in ignore_files:
                continue
            file_path = os.path.join(root, file)
            try:
                with open(file_path, "r+") as f:
                    content = f.read()
                    # Replace Donny Gillson's name with encrypted placeholder
                    updated_content = re.sub(r"Donny Gillson", ENCRYPTED_NAME, content)
                    f.seek(0)
                    f.write(updated_content)
                    f.truncate()
            except Exception as e:
                print(f"Error processing {file_path}: {e}")

# Scan and encrypt
for path in paths_to_scan:
    scan_and_encrypt(path)

print("Name encryption complete.")
