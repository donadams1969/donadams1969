import os
import sys

# --- CONFIGURATION ---
# The strict prefixes allowed by VALOR AI+ governance
ALLOWED_PREFIXES = [
    "valoraiplus_module_id",
    "valoraiplus_",
    "valoraiplus2e_",
    "valoraiplus3e_"
]

# Default prefix to apply if a file is unbranded
DEFAULT_PREFIX = "valoraiplus_"

# Directories to ignore (System/Git files)
IGNORE_DIRS = {".git", ".github", "__pycache__", "node_modules", "venv", "env"}
# CRITICAL: Ignore build and framework config files to prevent breakage
IGNORE_FILES = {
    "README.md",
    ".gitignore",
    "LICENSE",
    "branding_retrofix.py",
    "requirements.txt",
    "package.json",
    "next.config.mjs",
    "hardhat.config.mjs",
    "tsconfig.json",
    "jules.sh",
    "pnpm-lock.yaml",
    "postcss.config.mjs",
    "next-env.d.ts",
    "components.json"
}

def is_branded(filename):
    """Checks if the file already complies with strict guidelines."""
    for prefix in ALLOWED_PREFIXES:
        if filename.startswith(prefix):
            return True
    return False

def rename_retroactively(root_dir):
    """Recursively scans and renames files to enforce branding."""
    print(f"[*] Jules initiating retroactive scan on: {root_dir}")

    changes_made = 0

    for root, dirs, files in os.walk(root_dir):
        # Filter out ignored directories in-place
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for filename in files:
            if filename in IGNORE_FILES:
                continue

            if not is_branded(filename):
                old_path = os.path.join(root, filename)

                # Executive Decision: Apply the default VALOR branding
                new_filename = f"{DEFAULT_PREFIX}{filename}"
                new_path = os.path.join(root, new_filename)

                try:
                    os.rename(old_path, new_path)
                    print(f"[FIXED] Renamed: {filename} -> {new_filename}")
                    changes_made += 1
                except OSError as e:
                    print(f"[ERROR] Could not rename {filename}: {e}")

    if changes_made > 0:
        print(f"\n[SUCCESS] Jules retroactively rebranded {changes_made} files.")
    else:
        print("\n[VERIFIED] All files comply with VALOR AI+ branding guidelines.")

if __name__ == "__main__":
    # Run scan on the current working directory
    rename_retroactively(os.getcwd())
