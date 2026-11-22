#!/usr/bin/env bash
# Rebuilds the deployable package in dist/ (country pages, sitemap, Worker bundle).
set -euo pipefail
cd "$(dirname "$0")/.."

node tools/counts.cjs > tools/.counts.json
python3 tools/gen_pages.py

npx esbuild worker.js --bundle --format=esm --platform=neutral \
  --conditions=workerd,worker,browser --target=es2022 \
  --outfile=dist/worker.js --log-level=warning

rm -rf dist/site
mkdir -p dist/site
cp index.html review.html compare.html \
  bangladesh.html india.html usa.html uk.html canada.html australia.html europe.html \
  styles.css app.js favorites.js analytics.js ratings.js pwa.js data.js data-en.js i18n.js theme.js review.js \
  share.js compare.js compare-page.js country.js \
  favicon.svg favicon.ico sitemap.xml robots.txt manifest.webmanifest sw.js dist/site/
cp -r assets dist/site/assets

echo "build ok: $(du -sh dist | cut -f1)"
