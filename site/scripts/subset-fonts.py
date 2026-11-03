#!/usr/bin/env python3
"""中文字体子集生成器。

`app/fonts/noto-sans-sc-subset.woff2` 由本脚本产出，供 `app/fonts.ts` 里的
`next/font/local` 引用。改完站内文案后重跑：

    python scripts/subset-fonts.py

**改文案后必须重跑**：子集是「按当前源码里出现过的字」切的，新增一个没被
切进来的汉字，它不会报错，只会静默回退到系统字体 —— 同一个标题里两种字形，
只有肉眼看才发现。

为什么需要它：`@fontsource-variable/noto-sans-sc` 把 Noto Sans SC 切成 101 个
unicode-range 分片，浏览器按页面实际用到的字符串行命中，首屏十几片、约 670KB，
且是一条串行请求链。本站汉字总量很小（约 1100 个），整站子集化成一个文件一次
拿全，体积只有 ~271KB，没有串行链。

为什么默认不塞 GB2312 一级字库：那样会从 271KB 涨到 1000KB+（实测 1003KB），
而这个文件是全站 preload 的，等于给每个页面的首屏凭空加 700KB。站外动态文本
（GitHub 仓库名、issue 标题）确实可能撞上子集外的字，但它们都在需要滚动才可见
的区域，回退系统字体不影响首屏；真要覆盖可以加 --gb2312，自己权衡。

用法：
    python scripts/subset-fonts.py
    python scripts/subset-fonts.py --gb2312          # 加 GB2312 一级兜底（+730KB）
    python scripts/subset-fonts.py --src _source/NotoSansSC-VF.ttf

依赖：fontTools + brotli（pip install fonttools brotli）。

源字体不进仓库（几十 MB）：从 https://github.com/notofonts/noto-cjk/releases
取 `NotoSansSC[wght].ttf`，重命名为 NotoSansSC-VF.ttf 放进 _source/。
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from fontTools import subset
    from fontTools.ttLib import TTFont
except ImportError:  # pragma: no cover - 只是给一句人话报错
    sys.exit("缺少 fontTools。先跑：pip install fonttools brotli")

SITE_ROOT = Path(__file__).resolve().parent.parent

DEFAULT_SRC = SITE_ROOT / "_source" / "NotoSansSC-VF.ttf"
DEFAULT_DST = SITE_ROOT / "app" / "fonts" / "noto-sans-sc-subset.woff2"

# 扫这些目录下的源码文本，收集站内实际出现的字符。
SCAN_DIRS = ["app", "components", "lib", "context"]
SCAN_EXTS = {".tsx", ".ts", ".css", ".scss"}
# 字符画帧数据是纯 ASCII 的艺术字，扫它没有意义还会拖慢脚本。
SCAN_SKIP = {"ascii-frames.ts"}

# GB2312 一级汉字区：0xB0A1-0xD7F9，按拼音排序的 3755 个最常用字。
GB2312_LEVEL1 = ((0xB0, 0xD8), (0xA1, 0xFF))


def site_chars() -> set[str]:
    """站内源码出现过的全部字符（含标点、拉丁、CJK）。"""
    chars: set[str] = set()
    seen = 0
    for name in SCAN_DIRS:
        root = SITE_ROOT / name
        if not root.is_dir():
            continue
        for path in root.rglob("*"):
            if not path.is_file() or path.suffix not in SCAN_EXTS:
                continue
            if path.name in SCAN_SKIP:
                continue
            chars |= set(path.read_text(encoding="utf-8"))
            seen += 1
    print(f"扫描 {seen} 个源文件，站内字符 {len(chars)} 个")
    return chars


def gb2312_level1() -> set[str]:
    """GB2312 一级汉字（按拼音序的 3755 个常用字）。"""
    chars: set[str] = set()
    (hi_lo, hi_hi), (lo_lo, lo_hi) = GB2312_LEVEL1
    for hi in range(hi_lo, hi_hi):
        for lo in range(lo_lo, lo_hi):
            try:
                chars.add(bytes([hi, lo]).decode("gb2312"))
            except UnicodeDecodeError:
                pass  # 区里留空的位置（0xD7FA-0xD7FE 等）
    print(f"GB2312 一级字库 {len(chars)} 个")
    return chars


def build_charset(include_gb2312: bool = False) -> str:
    chars = site_chars()
    if include_gb2312:
        chars |= gb2312_level1()
    # 空白字符没有字形，留在文本里只会让 fontTools 抱怨。
    chars = {c for c in chars if not c.isspace() and c.isprintable()}
    return "".join(sorted(chars))


def main() -> None:
    ap = argparse.ArgumentParser(description="生成 Noto Sans SC 子集字体")
    ap.add_argument("--src", type=Path, default=DEFAULT_SRC, help="源可变字体 .ttf")
    ap.add_argument("--dst", type=Path, default=DEFAULT_DST, help="输出 .woff2")
    ap.add_argument(
        "--gb2312",
        action="store_true",
        help="额外并入 GB2312 一级字库（覆盖站外动态文本，体积约 +730KB）",
    )
    args = ap.parse_args()

    if not args.src.exists():
        sys.exit(
            f"找不到源字体 {args.src}\n"
            "从 https://github.com/notofonts/noto-cjk/releases 取 NotoSansSC[wght].ttf，\n"
            "重命名为 NotoSansSC-VF.ttf 放到 _source/ 下，或用 --src 指定路径。"
        )

    text = build_charset(args.gb2312)
    print(f"子集字符总数 {len(text)}")

    opts = subset.Options()
    opts.flavor = "woff2"
    # 保留默认 OpenType 特性（kern / liga / locl / vert ...）与 GDEF：
    # 砍掉特性省不到 5KB，却可能让标点挤压和本地化字形变样，不值。
    opts.hinting = False  # CJK 在屏显下几乎不靠 hinting，关掉省 ~40KB
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    opts.recalc_bounds = True
    # 可变字重轴原样保留：app/fonts.ts 声明了 weight: "300 900"。

    font = TTFont(str(args.src))
    print(f"载入源字体，字形 {len(font.getGlyphOrder())} 个")

    sub = subset.Subsetter(options=opts)
    sub.populate(text=text)
    sub.subset(font)
    font.flavor = "woff2"

    args.dst.parent.mkdir(parents=True, exist_ok=True)
    font.save(str(args.dst))
    print(f"输出 {args.dst.relative_to(SITE_ROOT)}：{args.dst.stat().st_size / 1024:.1f} KB")

    # 自检：源码里的字符必须全部落在子集里，否则就是静默回退系统字体。
    cmap = set(font.getBestCmap())
    missing = [c for c in text if ord(c) not in cmap]
    if missing:
        print(f"警告：{len(missing)} 个字符源字体里没有字形（会回退）：{''.join(missing)}")
    else:
        print("自检通过：所有字符均有字形")


if __name__ == "__main__":
    main()
