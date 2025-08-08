#!/usr/bin/env bash
set -euo pipefail
FILE="$1"                                 # path/to/file.zip
NAME="$(basename "$FILE")"
OUTDIR="${2:-downloads}"                  # default: downloads
PRIMARY="${3:-https://scrollkeeper-codex.org/downloads}"
FALLBACK="${4:-https://www.skrollkeeper.org/downloads}"

mkdir -p "$OUTDIR"
SHA=$(sha256sum "$FILE" | cut -d' ' -f1)
SIZE=$(stat -c%s "$FILE" 2>/dev/null || stat -f%z "$FILE")

cat > "$OUTDIR/${NAME%.zip}.html" <<HTML
<!doctype html><meta charset="utf-8">
<title>$NAME — Download</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{font:16px/1.5 system-ui;margin:2rem auto;max-width:720px;padding:0 1rem}</style>
<h1>$NAME — Download</h1>
<ul>
  <li><a href="$PRIMARY/$NAME">Primary (codex)</a></li>
  <li><a href="$FALLBACK/$NAME">Fallback (skroll)</a></li>
</ul>
<h2>Verify</h2>
<pre>sha256sum $NAME
# expected:
$SHA
</pre>
<p>JSON manifest: <a href="${NAME%.zip}.json">${NAME%.zip}.json</a></p>
<footer style="margin-top:2rem;opacity:.7">VALORCHAIN™ © ® — Property of That's Edutainment LLC</footer>
HTML

cat > "$OUTDIR/${NAME%.zip}.json" <<JSON
{
  "name": "$NAME",
  "sha256": "$SHA",
  "size_bytes": $SIZE,
  "mirrors": ["$PRIMARY/$NAME","$FALLBACK/$NAME"],
  "issued_at": "$(date -u +%FT%TZ)",
  "owner": "That's Edutainment LLC — VALORCHAIN™"
}
JSON

echo "Wrote:"
echo " - $OUTDIR/${NAME%.zip}.html"
echo " - $OUTDIR/${NAME%.zip}.json"
