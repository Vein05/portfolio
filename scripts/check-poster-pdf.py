#!/usr/bin/env python3
"""Check a printed poster sheet: page geometry, and whether it actually fits.

`Pages: 1` never proves a poster fits — the print rules clip with
`overflow: hidden`, so an overflowing sheet still reports one page. The real
test is that the lowest content pixel sits at or just inside the canvas
padding.

Chrome's PDF raster leaves a one-pixel artifact line on the page edges at some
resolutions, which a naive scan counts as content and reports as a 0 mm margin.
That is dpi-dependent, so it false-alarms on some sheets and not others. This
inhibits a 2 px frame and requires a row to carry more than 1% of the page
width before it counts as content.

Usage:
    python3 scripts/check-poster-pdf.py <url> [portrait|landscape]
"""
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
# The poster canvas is self-contained and does NOT use the site palette:
# poster.css defines its own --color-paper-light. Using the site's 245/240/232
# here reads the real paper as content and silently reports 0mm.
PAPER = np.array([250, 249, 246])
SHEETS = {
    # label: (mm height, expected pt width, expected pt height, bottom padding mm)
    "portrait": (1189.0, 2383.92, 3370.08, 22.0),
    "landscape": (812.8, 3168.0, 2304.0, 22.0),
}
FRAME = 2      # px of page edge to inhibit
MIN_FRAC = 0.01  # a row must carry >1% of the width to count as content


def main(url: str, sheet: str) -> int:
    mm_h, exp_w, exp_h, pad = SHEETS[sheet]
    with tempfile.TemporaryDirectory() as tmp:
        pdf = Path(tmp) / "sheet.pdf"
        subprocess.run(
            [CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
             "--virtual-time-budget=15000", f"--print-to-pdf={pdf}", url],
            check=True, capture_output=True,
        )
        info = subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout
        pages = next(l.split(":")[1].strip() for l in info.splitlines() if l.startswith("Pages"))
        size = next(l.split(":", 1)[1].strip() for l in info.splitlines() if l.startswith("Page size"))

        stem = Path(tmp) / "page"
        subprocess.run(["pdftoppm", "-png", "-r", "30", "-singlefile", str(pdf), str(stem)],
                       check=True, capture_output=True)
        im = np.asarray(Image.open(f"{stem}.png").convert("RGB")).astype(int)

    h, w, _ = im.shape
    body = im[FRAME:h - FRAME, FRAME:w - FRAME]
    content = (np.abs(body - PAPER).sum(axis=2) > 30).sum(axis=1)
    rows = np.where(content > w * MIN_FRAC)[0]
    margin = (len(content) - rows.max() - 1) / h * mm_h if len(rows) else mm_h

    ok_pages = pages == "1"
    ok_size = f"{exp_w:g}" in size and f"{exp_h:g}" in size
    ok_fit = margin > 1.0

    print(f"  url         {url}")
    print(f"  pages       {pages}          {'ok' if ok_pages else 'FAIL, expected 1'}")
    print(f"  page size   {size}   {'ok' if ok_size else f'FAIL, expected {exp_w:g} x {exp_h:g}'}")
    print(f"  bottom      {margin:.1f}mm    "
          f"{'ok' if ok_fit else 'FAIL, content reaches the sheet edge (clipped)'}"
          f"{'' if margin <= pad + 1 else '  (note: more slack than the %gmm padding)' % pad}")
    return 0 if (ok_pages and ok_size and ok_fit) else 1


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    url = sys.argv[1]
    sheet = sys.argv[2] if len(sys.argv) > 2 else ("landscape" if "landscape" in url else "portrait")
    sys.exit(main(url, sheet))
