#!/bin/bash
# Copy the static files Vite does not know about into dist/.
#
# `vite build` produces dist/ with the HTML, hashed JS/CSS and the worklet.
# These files are never imported by a page, so nothing references them from
# the module graph and Vite would leave them out: the service worker, the
# manifest and its icons, and the crawler files.
#
# Run AFTER vite build — this adds to dist/, it does not create it.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist"

if [ ! -d "$DIST" ]; then
    echo "dist/ does not exist — run 'vite build' first" >&2
    exit 1
fi

for f in "$ROOT"/manifest.webmanifest "$ROOT"/sw.js "$ROOT"/_headers "$ROOT"/_redirects \
         "$ROOT"/sitemap.xml "$ROOT"/robots.txt "$ROOT"/favicon.svg "$ROOT"/social-card.png; do
    [ -f "$f" ] && cp "$f" "$DIST/"
done

cp -R "$ROOT/icons" "$DIST/icons"

echo "dist/ ready: $(find "$DIST" -type f | wc -l | tr -d ' ') files"
