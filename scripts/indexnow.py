#!/usr/bin/env python3
"""Ping IndexNow (Bing, Yandex, Seznam, Naver) with spanthi.com URLs.

Bing's index backs ChatGPT search and Copilot, and Bing does not wait for a
recrawl when it gets an IndexNow ping. Run after a deploy:

  scripts/indexnow.py                     (every URL in the live sitemap)
  scripts/indexnow.py /blog/slug/ ...     (just these paths)

The key file public/9487d40c57ee4bfcb0a0c4e8dda6374d.txt must be live at the site root.
"""

import json
import re
import sys
import urllib.request

ORIGIN = "https://spanthi.com"
KEY = "9487d40c57ee4bfcb0a0c4e8dda6374d"


def sitemap_urls() -> list[str]:
    index = urllib.request.urlopen(f"{ORIGIN}/sitemap-index.xml").read().decode()
    urls = []
    for sm in re.findall(r"<loc>([^<]+)</loc>", index):
        urls += re.findall(r"<loc>([^<]+)</loc>", urllib.request.urlopen(sm).read().decode())
    return urls


def main() -> None:
    urls = [ORIGIN + p for p in sys.argv[1:]] or sitemap_urls()
    body = json.dumps({
        "host": "spanthi.com",
        "key": KEY,
        "keyLocation": f"{ORIGIN}/{KEY}.txt",
        "urlList": urls,
    }).encode()
    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow", data=body,
        headers={"Content-Type": "application/json; charset=utf-8"},
    )
    with urllib.request.urlopen(req) as r:
        print(f"{r.status} for {len(urls)} URLs")


if __name__ == "__main__":
    main()
