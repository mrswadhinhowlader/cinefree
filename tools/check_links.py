"""Checks every external service URL in data.js and every local page/asset link.

Usage:  python3 tools/check_links.py
Exit code is 1 when a link is broken (404/410 or dead host), 0 otherwise.
403/429 are reported as "blocked" (the site refuses bots, not a broken link).
"""

import concurrent.futures
import os
import re
import ssl
import sys
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)
CTX = ssl.create_default_context()


def read(name):
    return open(os.path.join(ROOT, name), encoding="utf-8").read()


def service_urls():
    src = read("data.js")
    block = src.split("const SERVICE_URLS", 1)[1].split("};", 1)[0]
    return re.findall(r'^\s*"?([\w-]+)"?:\s*"([^"]+)"', block, re.M)


def internal_links():
    """Local href/src targets in the served HTML/JS files."""
    targets = set()
    files = [f for f in os.listdir(ROOT) if f.endswith(".html")] + [
        "app.js",
        "review.js",
        "compare.js",
        "sw.js",
        "manifest.webmanifest",
    ]
    for name in files:
        path = os.path.join(ROOT, name)
        if not os.path.exists(path):
            continue
        src = read(name)
        for attr in re.findall(r'(?:href|src)="([^"]+)"', src):
            if attr.startswith(("http", "#", "mailto:", "data:")) or "${" in attr:
                continue
            targets.add(attr.split("#")[0].split("?")[0])
        for attr in re.findall(r'"\./?([\w./-]+\.(?:js|css|png|jpg|svg|html|webmanifest))"', src):
            if "${" not in attr:
                targets.add(attr)
    return sorted(t for t in targets if t)


def check(url):
    req = urllib.request.Request(
        url,
        method="GET",
        headers={
            "User-Agent": UA,
            "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20, context=CTX) as res:
            return url, res.status, res.geturl(), ""
    except urllib.error.HTTPError as err:
        return url, err.code, "", str(err.reason)
    except Exception as err:  # DNS failure, timeout, TLS problem …
        return url, 0, "", type(err).__name__ + ": " + str(err)[:80]


def main():
    services = service_urls()
    print("checking %d service URLs …" % len(services))
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
        results = list(pool.map(check, [u for _, u in services]))
    by_url = {u: (s, f, e) for u, s, f, e in results}

    broken = []
    slow = []
    for sid, url in services:
        status, final, err = by_url[url]
        if status == 0 and "TimeoutError" in err:
            # slow or geo/bot-blocked from here — worth a manual look, not proof of a dead link
            slow.append((sid, url))
            print("slow?   %-18s %-45s %s" % (sid, url, err))
        elif status == 0 or status in (404, 410):
            broken.append((sid, url, status, err))
            print("BROKEN  %-18s %-45s %s %s" % (sid, url, status or "-", err))
        elif status >= 400:
            print("blocked %-18s %-45s %s" % (sid, url, status))
        else:
            moved = "" if not final or final.rstrip("/") == url.rstrip("/") else "→ " + final
            print("ok      %-18s %-45s %s %s" % (sid, url, status, moved))

    missing = [t for t in internal_links() if not os.path.exists(os.path.join(ROOT, t))]
    for t in missing:
        print("MISSING local file:", t)

    print("\n%d external links checked, %d broken, %d slow/blocked, %d missing local files"
          % (len(services), len(broken), len(slow), len(missing)))
    return 1 if broken or missing else 0


if __name__ == "__main__":
    sys.exit(main())
