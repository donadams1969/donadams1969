import os
import glob
import re

# Configuration
TARGET_IDENTITY = "Don Adams®️©️™️"
OLD_IDENTITIES = [
    "Donny Gillson Poppa",
    "Donny Gillson",
    "Donny G",
    "Don Adams", # Match without trademarks to upgrade
]

# Directories and files to ignore to prevent build/config failures
IGNORE_DIRS = {
    "node_modules",
    ".next",
    "dist",
    "build",
    "target",
    ".git",
    ".github",
    ".pnpm-store",
    "__pycache__"
}

IGNORE_FILES = {
    "package.json",
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "tsconfig.json",
    "next.config.mjs",
    "next.config.js",
    "postcss.config.mjs",
    "postcss.config.js",
    "components.json"
}

def should_ignore(filepath):
    # Check if the file is in an ignored directory
    path_parts = filepath.split(os.sep)
    for part in path_parts:
        if part in IGNORE_DIRS:
            return True

    # Check if the file is an ignored file
    filename = os.path.basename(filepath)
    if filename in IGNORE_FILES:
        return True

    # Ignore hidden files, except maybe specific ones if needed
    if filename.startswith('.') and filename != '.env':
        return True

    # Ignore binary files or common non-text files
    ext = os.path.splitext(filename)[1].lower()
    if ext in {'.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp', '.webm', '.mp4', '.pdf', '.zip', '.tar', '.gz'}:
        return True

    return False

def fix_branding(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Replace old identities with the new one
        for old_id in OLD_IDENTITIES:
            # Simple replace. Note: Might want to use regex for word boundaries if needed,
            # but simple replace is often safer for a broad sweep unless specified.
            # Avoid replacing if it's already the target to prevent double trademark symbols

            # Use regex to replace only if not followed by the trademarks
            pattern = re.compile(re.escape(old_id) + r'(?!®️©️™️)', re.IGNORECASE)
            content = pattern.sub(TARGET_IDENTITY, content)

        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated branding in {filepath}")

    except UnicodeDecodeError:
        # Skip binary files that slip through
        pass
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

def main():
    root_dir = "."
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Modify dirnames in-place to skip ignored directories
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]

        for filename in filenames:
            filepath = os.path.join(dirpath, filename)

            if not should_ignore(filepath):
                fix_branding(filepath)

if __name__ == "__main__":
    main()
