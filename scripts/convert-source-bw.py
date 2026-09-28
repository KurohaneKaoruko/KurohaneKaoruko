#!/usr/bin/env python3
"""把 404 源 GIF 转成黑白高对比版本（字符画的对比度在素材端解决）。

处理：每帧灰度 → P2/P98 对比拉伸 → S 曲线加陡 → 硬阈值混合（准二值化）→ 逐帧写回 GIF。
不用纯 1 位抖动：在 96 列字符网格上是噪点；准二值（保留一条窄过渡带描轮廓）才是
「发丝/眼睛纯黑、皮肤/背景纯白」的正确来源，参考站素材即是如此。

用法（默认值即当前线上素材参数）：
    python scripts/convert-source-bw.py
    python scripts/convert-source-bw.py --src _source/404-source-v4.gif --dst _source/404-source-v4-bw.gif --k 0.75 --hard 0.72

依赖：numpy / Pillow（本机 Anaconda 自带）。
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageSequence

DEFAULT_SRC = "_source/404-source-v4.gif"
DEFAULT_DST = "_source/404-source-v4-bw.gif"

# S 曲线强度：0 = 原线性，1 = 纯 smoothstep。越大中间调越少、黑白越分明。
DEFAULT_K = 0.75
# 硬阈值混合（0..1）：参考站素材是「准二值」（发丝/眼睛纯黑、皮肤纯白），中间调越少字符画越狠。
# 1 = 完全二值（锯齿重），0.7 左右 = 准二值且保留一条窄过渡带描轮廓。
DEFAULT_HARD = 0.72
# 阈值位置：auto = 每帧中位数（自动适应光线变化），或 0..1 固定值
DEFAULT_T = "auto"
# 过渡带宽度（相对亮度），窄带保住轮廓细节
RAMP_W = 0.06
# 对比拉伸的分位（把这一范围的亮度拉满 0..255）
P_LOW, P_HIGH = 2.0, 98.0


def s_curve(norm: np.ndarray, k: float) -> np.ndarray:
    """smoothstep 与线性按 k 插值：out = (1-k)·x + k·smoothstep(x)。"""
    s = norm * norm * (3.0 - 2.0 * norm)
    return (1.0 - k) * norm + k * s


def convert_frame(gray: np.ndarray, k: float, hard: float, t: str) -> np.ndarray:
    low, high = np.percentile(gray, P_LOW), np.percentile(gray, P_HIGH)
    span = max(float(high) - float(low), 1e-6)
    norm = np.clip((gray.astype(np.float32) - float(low)) / span, 0.0, 1.0)
    out = s_curve(norm, k)
    if hard > 0.0:
        pivot = float(np.median(norm)) if t == "auto" else float(t)
        ramp = np.clip((norm - (pivot - RAMP_W / 2)) / RAMP_W, 0.0, 1.0)
        step = ramp * ramp * (3.0 - 2.0 * ramp)  # 平滑过渡带的阈值阶跃
        out = (1.0 - hard) * out + hard * step
    return np.round(out * 255.0).astype(np.uint8)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=DEFAULT_SRC)
    ap.add_argument("--dst", default=DEFAULT_DST)
    ap.add_argument("--k", type=float, default=DEFAULT_K)
    ap.add_argument("--hard", type=float, default=DEFAULT_HARD)
    ap.add_argument("--t", default=DEFAULT_T)
    ap.add_argument("--p-low", type=float, default=P_LOW)
    ap.add_argument("--p-high", type=float, default=P_HIGH)
    args = ap.parse_args()

    if not 0.0 <= args.k <= 1.0:
        raise SystemExit("--k 须在 [0, 1]")
    if not 0.0 <= args.hard <= 1.0:
        raise SystemExit("--hard 须在 [0, 1]")
    if args.t != "auto":
        try:
            float(args.t)
        except ValueError:
            raise SystemExit("--t 须为 auto 或 0..1 数值")

    src = Path(args.src)
    if not src.exists():
        raise SystemExit(f"找不到源文件：{src}")

    im = Image.open(src)
    duration = im.info.get("duration", 100)
    frames: list[Image.Image] = []
    for frame in ImageSequence.Iterator(im):
        gray = np.array(frame.convert("L"), dtype=np.uint8)
        frames.append(Image.fromarray(convert_frame(gray, args.k, args.hard, args.t), mode="L"))

    dst = Path(args.dst)
    dst.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        dst,
        save_all=True,
        append_images=frames[1:],
        duration=duration,
        loop=0,
    )

    # 报告对比度变化：黑/白两端与中间调的像素占比
    allpix = np.concatenate([np.array(f, dtype=np.float32).ravel() for f in frames])
    dark = (allpix < 16).mean() * 100
    bright = (allpix > 239).mean() * 100
    mid = ((allpix >= 48) & (allpix <= 208)).mean() * 100
    print(f"帧数 {len(frames)}  尺寸 {frames[0].size[0]}×{frames[0].size[1]}  duration {duration}ms  k={args.k} hard={args.hard} t={args.t}")
    print(f"近黑(<16) {dark:.1f}%  近白(>239) {bright:.1f}%  中间调(48..208) {mid:.1f}%")
    print(f"已写出：{dst}（{dst.stat().st_size / 1024:.0f} KB）")


if __name__ == "__main__":
    main()
