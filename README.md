# CineFree

A bilingual (বাংলা / English) directory of **legal, genuinely free** streaming
services — movies, series, anime and live TV. CineFree hosts no video: it lists
services that stream under studio or public-domain licences, with ratings,
reviews, region availability and a synced favourites list.

Live site: https://cinefree-04fpmp.freebuff.site

## Stack

Plain HTML, CSS and JavaScript — no framework. A single Cloudflare Worker
(`worker.js`, bundled with esbuild into `dist/worker.js`) serves the static
pages and four small endpoints:

| Route | What it does |
| --- | --- |
| `GET /api/geo` | Country / continent hint used to pick the starting language |
| `GET /api/me` | Who is signed in (display only) |
| `GET /api/favorites`, `POST /api/favorites/toggle`, `POST /api/favorites/merge` | Synced favourites for the signed-in user (D1) |
| `GET /api/visits`, `POST /api/visit` | Public visit counter (D1, no cookies) |
| `GET /api/ratings`, `POST /api/ratings` | Visitor star ratings, 1–5 per service (D1, one anonymous vote per browser, changeable) |

Sign-in uses `@freebuff/auth` (OIDC). Favourites are cached in `localStorage`
under `cinefree:favorites:v1` and mirrored in D1 keyed by `user.sub`, so the
same list appears on every device.

## Develop

```bash
npm install
bash tools/build.sh        # country pages, sitemap, Worker bundle, dist/ package
npx wrangler dev --config wrangler.local.jsonc --local --ip 127.0.0.1 --port 8787
```

`tools/build.sh` regenerates the country pages from `index.html`, rewrites
`sitemap.xml` and `robots.txt`, and assembles the deployable `dist/` folder.

`python3 tools/check_links.py` requests every service URL in `data.js` plus
every local page and asset, and exits non-zero if one is broken. Run it before a
release: services close down and links move.

## Features worth knowing

- **Compare** — up to three services side by side (`compare.html?ids=tubi,plex`).
  The pick lives in `localStorage` under `cinefree:compare:v1` (`compare.js`).
- **Share** — card and review buttons use the native share sheet, falling back to
  copying the review link (`share.js`).
- **Country picker** — the header 🌍 button jumps to a country page (`country.js`).

## Google Analytics (optional)

`analytics.js` ships with `GA_ID = ""`. Paste a GA4 Measurement ID
(`G-XXXXXXXXXX`) there and rebuild to switch Google Analytics on. The footer
visit counter works without it.

## Licence

MIT — see [LICENSE](LICENSE). The service names, logos and trademarks belong to
their respective owners and are used here only to refer to those services.
