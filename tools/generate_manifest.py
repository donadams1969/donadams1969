import hashlib

def generate_sha3_512_manifest(filepath):
    """Calculates the SHA3-512 hash of a file and saves it to a new file.

    Args:
        filepath: The path to the file to hash.
    """
    hasher = hashlib.sha3_512()
    with open(filepath, "rb") as f:
        buf = f.read()
        hasher.update(buf)

    manifest_path = f"{filepath}.sha512"
    with open(manifest_path, "w") as f:
        f.write(hasher.hexdigest())

if __name__ == "__main__":
    generate_sha3_512_manifest("snapshots/OP25_RETURN_HEX_GENESIS_V3.8_FULL.md")
