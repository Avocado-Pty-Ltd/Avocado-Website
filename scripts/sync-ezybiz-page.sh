#!/usr/bin/env bash
#
# Regenerate the /ezybiz mirror of the EzyBiz homepage.
#
# avocadodigital.com.au/ezybiz shows the same content as https://ezybiz.ai/.
# Rather than proxying (host-dependent) or duplicating the whole EzyBiz site
# (drifts immediately), we mirror ONLY the homepage HTML and rewrite every
# relative URL to point absolutely at ezybiz.ai, so assets, fonts, the
# features iframe and all internal links always serve the live EzyBiz site.
# The canonical tag already points at https://ezybiz.ai/, which keeps search
# signals consolidated on the .ai domain.
#
# Usage:
#   scripts/sync-ezybiz-page.sh                  # fetch https://ezybiz.ai/
#   scripts/sync-ezybiz-page.sh path/to/index.html   # use a local checkout
#
# Run this whenever the EzyBiz homepage changes, then commit the result.
# Output: ezybiz.html (serves /ezybiz on Netlify & GitHub Pages) and
# ezybiz/index.html (serves /ezybiz/ on any static host).

set -euo pipefail
cd "$(dirname "$0")/.."

SRC="${1:-}"
TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

if [ -n "$SRC" ]; then
  cp "$SRC" "$TMP"
else
  curl -fsSL https://ezybiz.ai/ -o "$TMP"
fi

BASE="https://ezybiz.ai"

sed -i \
  -e "s|src=\"assets/|src=\"$BASE/assets/|g" \
  -e "s|href=\"/assets/|href=\"$BASE/assets/|g" \
  -e "s|href=\"assets/|href=\"$BASE/assets/|g" \
  -e "s|url(\"assets/|url(\"$BASE/assets/|g" \
  -e "s|src=\"features-animation.html\"|src=\"$BASE/features-animation.html\"|g" \
  -e "s|href=\"\(blog/[A-Za-z0-9_-]*\.html\)\"|href=\"$BASE/\1\"|g" \
  -e "s|href=\"blog/\"|href=\"$BASE/blog/\"|g" \
  -e "s|href=\"\([A-Za-z0-9_-]*\.html\)\"|href=\"$BASE/\1\"|g" \
  "$TMP"

# Guard: no relative references may survive (they would 404 on this domain).
if grep -qE '(src|href)="(assets/|/assets/|[A-Za-z0-9_-]+\.html)|url\("assets/' "$TMP"; then
  echo "ERROR: relative URLs remain after rewrite:" >&2
  grep -nE '(src|href)="(assets/|/assets/|[A-Za-z0-9_-]+\.html)|url\("assets/' "$TMP" >&2
  exit 1
fi

BANNER='<!-- MIRROR of https://ezybiz.ai/ — do not edit by hand.
     Regenerate with scripts/sync-ezybiz-page.sh (see that file for why). -->'

{ head -1 "$TMP"; echo "$BANNER"; tail -n +2 "$TMP"; } > ezybiz.html
mkdir -p ezybiz
cp ezybiz.html ezybiz/index.html

echo "OK: wrote ezybiz.html and ezybiz/index.html ($(wc -c < ezybiz.html) bytes)"
