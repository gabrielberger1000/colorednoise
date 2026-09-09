#!/bin/bash
# Assemble the deployable static site into dist/ (only what the browser needs;
# no Python composer, generator scripts, node_modules, or rendered videos).
# Used by `npm run deploy` and the Cloudflare Pages GitHub Action.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist"

rm -rf "$DIST"
mkdir -p "$DIST"

# Root files
for f in "$ROOT"/*.html "$ROOT"/manifest.webmanifest "$ROOT"/sw.js "$ROOT"/_headers \
         "$ROOT"/sitemap.xml "$ROOT"/robots.txt "$ROOT"/favicon.svg "$ROOT"/social-card.png; do
    [ -f "$f" ] && cp "$f" "$DIST/"
done

# Directories
for d in css js worklet icons presets; do
    cp -R "$ROOT/$d" "$DIST/$d"
done

echo "dist/ ready: $(find "$DIST" -type f | wc -l | tr -d ' ') files"
