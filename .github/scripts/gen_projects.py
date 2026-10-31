#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate the README projects panel from live GitHub data.

Reads the public repo list, picks the most-starred non-fork repos, and renders
two SVGs (dark / light) in the same HUD style as the rest of the README.

Usage:
    python gen_projects.py                                  # fetch from GitHub API
    python gen_projects.py --out dist/assets/projects
    python gen_projects.py --data repos.json --out assets   # offline snapshot

Only the standard library is used, so CI needs no pip install.
"""

import argparse
import json
import os
import urllib.request
from string import Template

USER = "KurohaneKaoruko"
LIMIT = 6
EXCLUDE = set()          # repo names that should never be featured
PIN = []                 # names always placed first, in this order

# Short hand-written blurbs. Anything not listed falls back to the repo
# description from the API, wrapped to the card width.
OVERRIDES = {
    "Iris-I.C.E.": "面向 AI 小说的集成创作环境。",
    "DSH-Novelist": "DeepSeek Harness 的小说写作智能体预设。",
    "ScreepsDashboard": "Screeps 的数据面板。",
    "Screeps-Tools": "用 Next.js 编写的 Screeps 工具合集网站。",
    "MiniTools-Rust": "用 Rust 编写的命令行小工具集。",
    "ExMachina": "以集体智能与集群协作为核心的 Agent 系统。",
}

# language -> (dark colour, light colour)
# Dark side is desaturated to sit beside the GitHub dark canvas (#0d1117)
# without glowing: colour shows up in tiny dots, never large areas, but each
# hue is lifted enough to stay legible on the dark background. Light side
# keeps GitHub-ish colours for contrast on white.
LANG_COLORS = {
    "TypeScript": ("#6b96bd", "#3178c6"),
    "JavaScript": ("#ab966f", "#9a6700"),
    "Rust": ("#bda996", "#a05a2c"),
    "Python": ("#6f95b3", "#3572A5"),
    "Dart": ("#6ba39c", "#00726c"),
    "Go": ("#6ba3ae", "#00708c"),
    "C": ("#8b949e", "#57606a"),
    "C++": ("#bd7d92", "#b32552"),
    "Java": ("#a89062", "#8a5a13"),
    "Shell": ("#8fb37e", "#3f7a1c"),
    "HTML": ("#b5806d", "#b03a1c"),
    "CSS": ("#8278a0", "#563d7c"),
    "Vue": ("#79ae93", "#2f8a60"),
    "Jupyter Notebook": ("#b08268", "#a8480a"),
}
FALLBACK_LANG = ("#8b949e", "#57606a")

# GitHub-dark-aligned palette: the README renders on GitHub's #0d1117 canvas,
# so the panels blend into the page instead of punching black holes in it.
# "blue" is the generic HUD accent and reads as off-white; the signal red is
# reserved for tiny blinking dots.
DARK = dict(bg1="#161c24", bg2="#0d1117", stroke="#30363d", grid="#21262d",
            gridop="0.30", text="#e6edf3", muted="#8b949e", dim="#6e7681",
            blue="#e6edf3", green="#ff453a", sweep="0.07", glow="0.05",
            cardfill="#161b22", side=0)

LIGHT = dict(bg1="#ffffff", bg2="#f6f8fa", stroke="#d0d7de", grid="#d0d7de",
             gridop="0.38", text="#1f2328", muted="#57606a", dim="#8c959f",
             blue="#0969da", green="#1a7f37", sweep="0.06", glow="0.04",
             cardfill="#ffffff", side=1)

FONT = ("'SF Mono','JetBrains Mono',Menlo,Consolas,'Liberation Mono','DejaVu Sans Mono',"
        "'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC','Source Han Sans SC',sans-serif")

COLS = 3
CARD_W, CARD_H = 352, 176
GAPX, GAPY = 24, 20
X0, Y0 = 48, 76
ROWS = (LIMIT + COLS - 1) // COLS
HEIGHT = Y0 + ROWS * CARD_H + (ROWS - 1) * GAPY + 44
BARS = [8, 12, 6, 15, 9, 17, 7, 11, 14, 6, 10, 16]

HEAD = """<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="$h" viewBox="0 0 1200 $h" font-family="$font">
<style>
@keyframes sweep{0%{transform:translateY(-200px)}100%{transform:translateY(${h}px)}}
@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:.12}}
@keyframes bar{0%,100%{opacity:.22}50%{opacity:.95}}
@keyframes card{0%,100%{stroke-opacity:.35}50%{stroke-opacity:1}}
.sweep{animation:sweep 8s linear infinite}
.blink{animation:blink 1.5s steps(1) infinite}
.bar{animation:bar 2.6s ease-in-out infinite}
.card{animation:card 5s ease-in-out infinite}
</style>
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="$bg1"/><stop offset="1" stop-color="$bg2"/>
</linearGradient>
<linearGradient id="sweepG" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="$blue" stop-opacity="0"/>
  <stop offset=".5" stop-color="$blue" stop-opacity="$sweep"/>
  <stop offset="1" stop-color="$blue" stop-opacity="0"/>
</linearGradient>
<radialGradient id="glow" cx="600" cy="240" r="560" gradientUnits="userSpaceOnUse">
  <stop offset="0" stop-color="$blue" stop-opacity="$glow"/>
  <stop offset="1" stop-color="$blue" stop-opacity="0"/>
</radialGradient>
<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
  <path d="M40 0H0V40" fill="none" stroke="$grid" stroke-width="1"/>
</pattern>
<clipPath id="clip"><rect width="1200" height="$h" rx="18"/></clipPath>
</defs>
<g clip-path="url(#clip)">
<rect width="1200" height="$h" fill="url(#bg)"/>
<rect width="1200" height="$h" fill="url(#grid)" opacity="$gridop"/>
<rect width="1200" height="$h" fill="url(#glow)"/>
<g class="sweep"><rect x="0" y="-200" width="1200" height="200" fill="url(#sweepG)"/></g>
<line x1="0" y1="52" x2="1200" y2="52" stroke="$stroke" stroke-opacity=".7"/>
<text x="44" y="35" font-size="18" font-weight="700" fill="$blue" letter-spacing=".5">&gt; projects</text>
<circle class="blink" cx="1022" cy="29" r="4.5" fill="$green"/>
<text x="1156" y="34" text-anchor="end" font-size="11" letter-spacing="2.4" fill="$dim">FEATURED</text>
<g fill="none" stroke="$blue" stroke-opacity=".5" stroke-width="1.5">
<path d="M20 44V22a2 2 0 0 1 2-2h22"/>
<path d="M1180 44V22a2 2 0 0 0-2-2h-22"/>
<path d="M20 ${bottom}v22a2 2 0 0 0 2 2h22"/>
<path d="M1180 ${bottom}v22a2 2 0 0 1-2 2h-22"/>
</g>
"""

TAIL = """</g>
<rect x=".5" y=".5" width="1199" height="${hm1}" rx="18" fill="none" stroke="$stroke" stroke-opacity=".9"/>
</svg>
"""


def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
             .replace('"', "&quot;"))


def display_width(s):
    return sum(2 if ord(c) > 0x2E80 else 1 for c in s)


def clip(s, limit=46):
    """Clip to roughly one card line, counting CJK as double width."""
    s = " ".join((s or "").split())
    if not s:
        return "暂无描述。"
    if display_width(s) <= limit:
        return s
    out, w = [], 0
    for c in s:
        cw = 2 if ord(c) > 0x2E80 else 1
        if w + cw > limit - 1:
            break
        out.append(c)
        w += cw
    return "".join(out).rstrip("，,、 ") + "…"


def pick(repos):
    cand = [r for r in repos
            if not r.get("fork") and not r.get("archived")
            and r["name"] != USER and r["name"] not in EXCLUDE]
    cand.sort(key=lambda r: (r["stargazers_count"], r["pushed_at"]), reverse=True)
    by_name = {r["name"]: r for r in cand}
    head = [by_name[n] for n in PIN if n in by_name]
    rest = [r for r in cand if r["name"] not in PIN]
    return (head + rest)[:LIMIT]


def render(repos, pal):
    out = [Template(HEAD).substitute(dict(pal, h=HEIGHT, font=FONT, bottom=HEIGHT - 44))]
    for i, r in enumerate(repos):
        lang = r.get("language") or ""
        dot = LANG_COLORS.get(lang, FALLBACK_LANG)[pal["side"]]
        name = esc(r["name"])
        desc = esc(OVERRIDES.get(r["name"]) or clip(r.get("description")))
        col, row = i % COLS, i // COLS
        x = X0 + col * (CARD_W + GAPX)
        y = Y0 + row * (CARD_H + GAPY)
        out.append(f'<rect x="{x}" y="{y}" width="{CARD_W}" height="{CARD_H}" rx="14" fill="{pal["cardfill"]}" stroke="{pal["stroke"]}" stroke-opacity=".9"/>')
        out.append(f'<rect class="card" style="animation-delay:{i * 0.4:.1f}s" x="{x}" y="{y}" width="{CARD_W}" height="{CARD_H}" rx="14" fill="none" stroke="{dot}" stroke-opacity=".5"/>')
        out.append(f'<circle cx="{x + 26}" cy="{y + 30}" r="4" fill="{dot}"/>')
        out.append(f'<text x="{x + 40}" y="{y + 34}" font-size="11" letter-spacing="1.8" fill="{pal["muted"]}">{esc(lang.upper() or "CODE")}</text>')
        out.append(f'<path d="M{x + 330} {y + 16}h8v8" fill="none" stroke="{dot}" stroke-width="1.5" stroke-opacity=".55"/>')
        out.append(f'<text x="{x + 26}" y="{y + 76}" font-size="19" font-weight="700" fill="{pal["text"]}">{name}</text>')
        out.append(f'<rect x="{x + 26}" y="{y + 88}" width="30" height="2.5" rx="1.2" fill="{dot}" opacity=".9"/>')
        out.append(f'<text x="{x + 26}" y="{y + 114}" font-size="13" fill="{pal["muted"]}">{desc}</text>')
        for j, bh in enumerate(BARS):
            out.append(f'<rect class="bar" style="animation-delay:{(i * 0.2 + j * 0.13) % 2.6:.2f}s" '
                       f'x="{x + 26 + j * 12}" y="{y + 160 - bh}" width="3" height="{bh}" rx="1.5" fill="{dot}" opacity=".5"/>')
    return "".join(out) + Template(TAIL).substitute(dict(pal, hm1=HEIGHT - 1))


def fetch():
    url = f"https://api.github.com/users/{USER}/repos?per_page=100&sort=pushed"
    req = urllib.request.Request(url, headers={
        "Accept": "application/vnd.github+json",
        "User-Agent": f"{USER}-readme-bot",
    })
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="dist/assets/projects", help="output directory")
    ap.add_argument("--data", help="read a saved JSON repo list instead of calling the API")
    args = ap.parse_args()

    repos = json.load(open(args.data, encoding="utf-8")) if args.data else fetch()
    picked = pick(repos)
    os.makedirs(args.out, exist_ok=True)
    for name, pal in (("dark", DARK), ("light", LIGHT)):
        path = os.path.join(args.out, f"projects-{name}.svg")
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(render(picked, pal))
        print(f"{path}  ({len(picked)} repos)")
    print("  " + " | ".join(f"{r['name']} ★{r['stargazers_count']}" for r in picked))


if __name__ == "__main__":
    main()
