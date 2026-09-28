#!/usr/bin/env -S uv run --quiet --with google-api-python-client --with google-auth python
"""Query Google Search Console for spanthi.com.

Usage:
  scripts/gsc.py sites                                        (properties the service account can see)
  scripts/gsc.py pages   [--days 28] [--filter /blog/] [--limit 50]
  scripts/gsc.py queries [--days 28] [--filter /blog/slug/] [--limit 50]
  scripts/gsc.py page    /blog/slug/ [--days 28]
  scripts/gsc.py daily   [--days 28]
  scripts/gsc.py inspect /blog/slug-one/ /blog/slug-two/ ...  (index status per URL)
  scripts/gsc.py inspect --recent-posts                       (every sitemap URL with lastmod in the last 60 days)
  scripts/gsc.py new     [--days 7] [--lookback 90]           (pages whose first-ever impression is in the last N days)
  scripts/gsc.py sitemaps                                     (submitted sitemaps and their last read)
  scripts/gsc.py submit                                       (resubmit /sitemap-index.xml; needs Full permission)

Credentials: the same service account as costumary
(gsc-reader@costumary.iam.gserviceaccount.com). Its key is read from
GSC_KEY, default ~/Documents/costumary/tools/gsc/service-account.json.
The service account email must be added as a user on the spanthi.com
Search Console property.
"""

import argparse
import json
import os
import re
import sys
import urllib.request
from datetime import date, timedelta
from pathlib import Path

from google.oauth2 import service_account
from googleapiclient.discovery import build

ORIGIN = "https://spanthi.com"
SITEMAP = f"{ORIGIN}/sitemap-index.xml"
KEY_PATH = Path(os.environ.get(
    "GSC_KEY", Path.home() / "Documents/costumary/tools/gsc/service-account.json"
))


def client():
    creds = service_account.Credentials.from_service_account_file(
        KEY_PATH, scopes=["https://www.googleapis.com/auth/webmasters"]
    )
    return build("searchconsole", "v1", credentials=creds, cache_discovery=False)


def site(svc) -> str:
    # The property may be a domain property or a URL-prefix one; use whichever
    # the service account was added to.
    for s in svc.sites().list().execute().get("siteEntry", []):
        if s["siteUrl"] in ("sc-domain:spanthi.com", f"{ORIGIN}/"):
            return s["siteUrl"]
    sys.exit(
        "service account has no access to spanthi.com; add "
        "gsc-reader@costumary.iam.gserviceaccount.com as a user in Search Console"
    )


def query(dimensions: list[str], days: int, page_filter: str | None, limit: int) -> list[dict]:
    end = date.today() - timedelta(days=2)
    start = end - timedelta(days=days)
    body = {
        "startDate": start.isoformat(),
        "endDate": end.isoformat(),
        "dimensions": dimensions,
        "rowLimit": limit,
    }
    if page_filter:
        body["dimensionFilterGroups"] = [{
            "filters": [{"dimension": "page", "operator": "contains", "expression": page_filter}]
        }]
    svc = client()
    rows = svc.searchanalytics().query(siteUrl=site(svc), body=body).execute().get("rows", [])
    return [
        {
            **dict(zip(dimensions, r["keys"])),
            "clicks": r["clicks"],
            "impressions": r["impressions"],
            "ctr": round(r["ctr"] * 100, 1),
            "position": round(r["position"], 1),
        }
        for r in rows
    ]


def inspect(paths: list[str]) -> None:
    svc = client()
    prop = site(svc)
    for path in paths:
        url = path if path.startswith("http") else f"{ORIGIN}{path}"
        r = svc.urlInspection().index().inspect(
            body={"inspectionUrl": url, "siteUrl": prop}
        ).execute()["inspectionResult"]["indexStatusResult"]
        crawled = (r.get("lastCrawlTime") or "never")[:10]
        print(f"{url.replace(ORIGIN, ''):60} {r.get('coverageState', '?'):40} crawled={crawled}")


def first_seen(days: int, lookback: int) -> None:
    # Search Analytics has no "indexed" list, but a page can only earn an impression
    # once indexed, so first impression date is the earliest-possible index signal.
    # dataState=all includes the last ~2 days that the finalized data omits.
    svc = client()
    prop = site(svc)
    end = date.today()
    start = end - timedelta(days=lookback)
    first: dict[str, str] = {}
    totals: dict[str, list[float]] = {}
    start_row = 0
    while True:
        rows = svc.searchanalytics().query(siteUrl=prop, body={
            "startDate": start.isoformat(),
            "endDate": end.isoformat(),
            "dimensions": ["page", "date"],
            "rowLimit": 25000,
            "startRow": start_row,
            "dataState": "all",
        }).execute().get("rows", [])
        for r in rows:
            page, day = r["keys"]
            first[page] = min(first.get(page, day), day)
            t = totals.setdefault(page, [0, 0])
            t[0] += r["clicks"]
            t[1] += r["impressions"]
        if len(rows) < 25000:
            break
        start_row += 25000
    cutoff = (end - timedelta(days=days)).isoformat()
    new = sorted((d, p) for p, d in first.items() if d >= cutoff)
    print(f"{len(new)} pages with first impression since {cutoff} (no impressions in the {lookback - days} days before)")
    for d, p in new:
        print(f"{d}  clicks={int(totals[p][0]):<4} impr={int(totals[p][1]):<6} {p.replace(ORIGIN, '')}")


def recent_post_paths(days: int) -> list[str]:
    # Blog posts carry lastmod = publish date in the generated sitemap.
    since = (date.today() - timedelta(days=days)).isoformat()
    with urllib.request.urlopen(f"{ORIGIN}/sitemap-0.xml") as resp:
        xml = resp.read().decode()
    return [
        loc for loc, mod in re.findall(r"<loc>([^<]+)</loc><lastmod>([^<]+)</lastmod>", xml)
        if mod[:10] >= since
    ]


def sitemaps(submit: bool) -> None:
    svc = client()
    prop = site(svc)
    if submit:
        svc.sitemaps().submit(siteUrl=prop, feedpath=SITEMAP).execute()
        print(f"submitted {SITEMAP}")
    for s in svc.sitemaps().list(siteUrl=prop).execute().get("sitemap", []):
        print(
            f"{s['path']:45} submitted={s.get('lastSubmitted', '?')[:10]} "
            f"read={s.get('lastDownloaded', 'never')[:10]} errors={s.get('errors', 0)} "
            f"warnings={s.get('warnings', 0)}"
        )


def print_table(rows: list[dict]) -> None:
    if not rows:
        print("no rows")
        return
    keys = list(rows[0].keys())
    widths = {k: max(len(k), *(len(str(r[k])) for r in rows)) for k in keys}
    print("  ".join(k.ljust(widths[k]) for k in keys))
    for r in rows:
        print("  ".join(str(r[k]).replace(ORIGIN, "").ljust(widths[k]) for k in keys))


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("mode", choices=["sites", "pages", "queries", "page", "daily", "inspect", "new", "sitemaps", "submit"])
    p.add_argument("target", nargs="*")
    p.add_argument("--recent-posts", action="store_true")
    p.add_argument("--days", type=int, default=28)
    p.add_argument("--lookback", type=int, default=90)
    p.add_argument("--filter")
    p.add_argument("--limit", type=int, default=50)
    p.add_argument("--json", action="store_true")
    a = p.parse_args()

    if not KEY_PATH.exists():
        sys.exit(f"missing {KEY_PATH}; set GSC_KEY or see docstring")

    if a.mode == "sites":
        for s in client().sites().list().execute().get("siteEntry", []):
            print(f"{s['siteUrl']:35} {s['permissionLevel']}")
        return

    if a.mode in ("sitemaps", "submit"):
        sitemaps(a.mode == "submit")
        return

    if a.mode == "new":
        first_seen(a.days, a.lookback)
        return

    if a.mode == "inspect":
        inspect(recent_post_paths(60) if a.recent_posts else a.target)
        return

    if a.mode == "pages":
        rows = query(["page"], a.days, a.filter, a.limit)
    elif a.mode == "queries":
        rows = query(["query"], a.days, a.filter, a.limit)
    elif a.mode == "page":
        rows = query(["query"], a.days, a.target[0], a.limit)
    else:
        rows = query(["date"], a.days, a.filter, a.limit)

    print(json.dumps(rows, indent=1) if a.json else "", end="")
    if not a.json:
        print_table(rows)


if __name__ == "__main__":
    main()
