#!/usr/bin/env python3
"""404 字符画帧数据生成器。

把一段 GIF 转成字符画帧序列，产出两个文件供 `app/not-found.tsx` 使用：

  public/ascii-frames.bin.gz   全部帧（gzip 的纯文本，每帧 rows 行、行间 \\n）
  app/ascii-frames.ts          常量 + 内嵌首帧（首屏 / 数据未加载时的同步兜底）

运行时前端 fetch bin.gz，用 DecompressionStream 解压成帧数组按 FPS 播放；
解压不可用或超时就退回内嵌首帧，所以首帧必须同步可得。

用法（默认值即当前线上参数）：
    python scripts/gen-ascii-frames.py
    python scripts/gen-ascii-frames.py --src _source/404-source-v4.gif --cols 96 --rows 103

依赖：numpy / opencv-python / Pillow（本机 Anaconda 自带）。
"""

from __future__ import annotations

import argparse
import gzip
import json
from collections import Counter
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageSequence

# 线上素材 = 黑白柔和对比版（convert-source-bw.py --k 0.75 --hard 0，v59：用户定稿此档观感）。
# 更强/更弱对比：改 convert-source-bw.py 的 --hard（0=本档，0.72=准二值）后重跑两个脚本。
DEFAULT_SRC = "_source/404-source-v4-bw.gif"
DEFAULT_OUT_GZ = "public/ascii-frames.bin.gz"
DEFAULT_OUT_TS = "app/ascii-frames.ts"

# 字号由网格密度反推：格越疏 → 每个字符占的屏幕尺寸越大。
# 演进：146×156（v3）→ 136×146（v4）→ 112×120 → 96×103（v47-v59 放大实验）→ 136×146（v60 回部署版，用户定稿细网格）。
DEFAULT_COLS = 136
DEFAULT_ROWS = 146

# 字符池四档：空格＝留白（白），'.'＝灰度填充（静态），'1'/'0'＝墨水（黑，前端运行时随机变异）。
# 具体显示 0 还是 1 由前端运行时随机变异（not-found.tsx），数据只负责圈出墨水区域。
DEFAULT_CHARS = " .'\"-_=+10"  # v63：0/1 互换——实测 Roboto Mono '0' 墨量是 '1' 的 2 倍+，最暗档该用 0

# 空白档（最亮的一档）占多少比例的单元 —— 白底与大部分脸部高光都落在这里。可用 --blank-share 覆盖。
# 其余档位在它以下等距切分。注意不能用「全档位等分位」—— 白底像素值高度集中，
# 分位边界会大量重复，把中间几档直接挤成空档（实测 '_' '-' '\'' 一个都没出现）。
BLANK_SHARE = 0.5  # v62：0.52 再收一档（用户试 0.5）

FPS = 10


def load_frames(src: Path, cols: int, rows: int) -> tuple[np.ndarray, tuple[int, int]]:
    """读 GIF 全部帧 → 灰度 → 面积加权降采样到 rows×cols。"""
    im = Image.open(src)
    src_size = im.size
    out = []
    for frame in ImageSequence.Iterator(im):
        gray = np.array(frame.convert("L"), dtype=np.uint8)
        # INTER_AREA = 面积平均，降采样最不失真
        out.append(cv2.resize(gray, (cols, rows), interpolation=cv2.INTER_AREA))
    return np.stack(out), src_size


def to_chars(frames: np.ndarray, chars: str) -> list[str]:
    """亮度 → 字符。先按 P1/P99 拉伸对比度，再切档。"""
    low, high = np.percentile(frames, 1), np.percentile(frames, 99)
    span = max(float(high) - float(low), 1e-6)
    norm = np.clip((frames.astype(np.float32) - low) / span, 0.0, 1.0)

    # 空白档的下界按分位定（= 整幅亮部的 BLANK_SHARE 分位），其余边界在 [0, top] 上等距
    top = float(np.percentile(norm, (1.0 - BLANK_SHARE) * 100))
    if top <= 1e-6:
        top = 1e-6
    edges = np.linspace(0.0, top, len(chars))[1:]

    # digitize: 0 = 最暗 … len(chars)-1 = 最亮；字符池是「亮→暗」，故反转取用
    idx = np.digitize(norm, edges)
    table = np.array(list(chars[::-1]))
    grid = table[idx]

    return ["\n".join("".join(row) for row in frame) for frame in grid]


def write_ts(
    path: Path, meta: dict[str, str], frame0: str, cols: int, rows: int, count: int
) -> None:
    header = "\n".join(f"   {k}：{v}" for k, v in meta.items())
    path.write_text(
        "/* 404 字符画帧数据（生成产物，勿手改）\n"
        f"{header}\n"
        "   生成器：scripts/gen-ascii-frames.py\n"
        "   体量：完整帧在 public/ascii-frames.bin.gz（运行时 fetch + DecompressionStream，\n"
        "        解压不可用或 3s 超时退化为本文件内嵌的帧 0）；本文件仅内嵌帧 0 */\n"
        f"export const ASCII_FPS = {FPS};\n"
        f"export const ASCII_COLS = {cols};\n"
        f"export const ASCII_ROWS = {rows};\n"
        f"export const ASCII_FRAME_COUNT = {count};\n"
        f"export const ASCII_FRAME0 = {json.dumps(frame0)};\n",
        encoding="utf-8",
    )


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=DEFAULT_SRC)
    ap.add_argument("--cols", type=int, default=DEFAULT_COLS)
    ap.add_argument("--rows", type=int, default=DEFAULT_ROWS)
    ap.add_argument("--chars", default=DEFAULT_CHARS)
    ap.add_argument("--blank-share", type=float, default=BLANK_SHARE)
    ap.add_argument("--out-gz", default=DEFAULT_OUT_GZ)
    ap.add_argument("--out-ts", default=DEFAULT_OUT_TS)
    args = ap.parse_args()

    src = Path(args.src)
    if not src.exists():
        raise SystemExit(f"找不到源文件：{src}")

    globals()["BLANK_SHARE"] = args.blank_share
    frames, (src_w, src_h) = load_frames(src, args.cols, args.rows)
    lines = to_chars(frames, args.chars)

    text = "\n".join(lines) + "\n"
    payload = text.encode("utf-8")
    gz_path = Path(args.out_gz)
    gz_path.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(gz_path, "wb", compresslevel=9) as fh:
        fh.write(payload)

    raw_kb = len(payload) / 1024
    gz_kb = gz_path.stat().st_size / 1024

    share = Counter("".join(lines))
    total = sum(share.values())
    pretty = "  ".join(f"{c!r}:{n / total * 100:.1f}%" for c, n in share.most_common())

    # 显示宽高比 = 列数×1em ÷ 行数×0.933em，应与源图一致（零变形）
    disp_ar = args.cols / (args.rows * 0.933)
    src_ar = src_w / src_h

    write_ts(
        Path(args.out_ts),
        {
            "来源": f"{src.as_posix()}（{src_w}×{src_h}、{len(lines)} 帧、{FPS}fps）",
            "映射": (
                f"全帧面积加权降采样 → {args.cols} 列 × {args.rows} 行，"
                f"显示 AR {disp_ar:.4f} vs 源 AR {src_ar:.4f}"
            ),
            "字符集": f"{args.chars}（亮→暗 {len(args.chars)} 档）",
            "体量": f"gzip {gz_path.stat().st_size} B → {args.out_gz}",
        },
        lines[0],
        args.cols,
        args.rows,
        len(lines),
    )

    print(f"帧数 {len(lines)}  网格 {args.cols}×{args.rows}  字符 {len(args.chars)} 档")
    print(f"未压缩 {raw_kb:.0f} KB → gzip {gz_kb:.0f} KB（压缩比 {raw_kb / gz_kb:.1f}×）")
    print(f"显示 AR {disp_ar:.4f} vs 源 AR {src_ar:.4f}  偏差 {abs(disp_ar / src_ar - 1) * 100:.2f}%")
    print("各档占比：", pretty)


if __name__ == "__main__":
    main()
