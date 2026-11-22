"""Generates the country pages, sitemap.xml and robots.txt from index.html."""

import datetime
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BASE = "https://cinefree-04fpmp.freebuff.site/"

data = json.load(open(os.path.join(HERE, ".counts.json"), encoding="utf-8"))
counts, ids = data["counts"], data["ids"]
tpl = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
today = datetime.date.today().isoformat()

PAGES = [
    ("bangladesh.html", "bangladesh", "বাংলাদেশ", "Bangladesh"),
    ("india.html", "india", "ভারত", "India"),
    ("usa.html", "us", "যুক্তরাষ্ট্র", "United States"),
    ("uk.html", "uk", "যুক্তরাজ্য", "United Kingdom"),
    ("canada.html", "canada", "কানাডা", "Canada"),
    ("australia.html", "australia", "অস্ট্রেলিয়া", "Australia"),
    ("europe.html", "europe", "ইউরোপ", "Europe"),
]


def bn_num(n):
    return str(n).translate(str.maketrans("0123456789", "০১২৩৪৫৬৭৮৯"))


for filename, region, bn_name, en_name in PAGES:
    n = counts.get(region, 0)
    title_bn = f"ফ্রি স্ট্রিমিং সাইট — {bn_name} | CineFree"
    title_en = f"Free streaming sites in {en_name} — CineFree directory"
    desc_bn = (
        f"{bn_name} থেকে ফ্রি-তে দেখা যায় এমন {bn_num(n)}টি বৈধ স্ট্রিমিং সার্ভিস "
        "— রেটিং, রিভিউ ও সার্চ সহ।"
    )
    desc_en = (
        f"{n} legal, genuinely free streaming services that work in {en_name} "
        "— with ratings, reviews and search."
    )
    html = tpl
    html = re.sub(r"<title>.*?</title>", f"<title>{title_en}</title>", html, count=1, flags=re.S)
    html = re.sub(
        r'<meta name="description" content=".*?" />',
        f'<meta name="description" content="{desc_en}" />',
        html,
        count=1,
    )
    html = re.sub(
        r'<link rel="canonical" href=".*?" />',
        f'<link rel="canonical" href="{BASE}{filename}" />',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta property="og:url" content=".*?" />',
        f'<meta property="og:url" content="{BASE}{filename}" />',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta property="og:title" content=".*?" />',
        f'<meta property="og:title" content="{title_en}" />',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta property="og:description" content=".*?" />',
        f'<meta property="og:description" content="{desc_en}" />',
        html,
        count=1,
    )
    preset = (
        "<script>window.REGION_PRESET=%s;"
        "window.PAGE_TITLE={bn:%s,en:%s};</script>\n"
        % (json.dumps(region), json.dumps(title_bn), json.dumps(title_en))
    )
    html = html.replace('<script src="data.js"></script>', preset + '<script src="data.js"></script>', 1)
    open(os.path.join(ROOT, filename), "w", encoding="utf-8").write(html)
    print("wrote", filename, "| services in region:", n)

urls = [(BASE, "1.0", "daily")]
for filename, region, _, _ in PAGES:
    urls.append((BASE + filename, "0.9", "weekly"))
for sid in ids:
    urls.append((BASE + "review.html?id=" + sid, "0.7", "monthly"))

parts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
]
for loc, prio, freq in urls:
    parts.append(
        f"  <url><loc>{loc}</loc><lastmod>{today}</lastmod>"
        f"<changefreq>{freq}</changefreq><priority>{prio}</priority></url>"
    )
parts.append("</urlset>")
open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8").write("\n".join(parts) + "\n")
print("sitemap urls:", len(urls))

open(os.path.join(ROOT, "robots.txt"), "w", encoding="utf-8").write(
    "User-agent: *\nAllow: /\n\nSitemap: " + BASE + "sitemap.xml\n"
)
print("robots written")
