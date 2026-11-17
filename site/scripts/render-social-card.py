"""Export the portfolio's own social card using its bundled OFL fonts.

Requires Playwright with Chrome installed. Run from site/ after npm run build:
python scripts/render-social-card.py
"""

import base64
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
svg = (ROOT / "public/social-card.svg").read_text(encoding="utf-8")
portrait = base64.b64encode((ROOT / "public/portrait-pixels.webp").read_bytes()).decode()
svg = svg.replace('href="portrait-pixels.webp"', f'href="data:image/webp;base64,{portrait}"')
fonts = []
for name, file in [
    ("Space Grotesk", "space-grotesk-variable.woff2"),
    ("IBM Plex Mono", "ibm-plex-mono-latin-400.woff2"),
]:
    data = base64.b64encode((ROOT / "app/fonts" / file).read_bytes()).decode()
    fonts.append(f"@font-face{{font-family:'{name}';src:url(data:font/woff2;base64,{data}) format('woff2');font-weight:100 700}}")
with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    page = browser.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
    page.set_content("<style>body{margin:0}" + "".join(fonts) + "</style>" + svg)
    page.evaluate("document.fonts.ready")
    page.locator("svg").screenshot(path=str(ROOT / "public/og.png"))
    browser.close()
print("Exported public/og.png with the site's own open-source fonts")
