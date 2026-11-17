"""Build both portrait layers from public/logo.jpg.

Requires Pillow, NumPy and OpenCV. Run from site/: python scripts/prepare-portrait.py
Segment at source resolution, protect the pale face, and remove the original
white background from partially covered edge pixels before resizing.
"""

import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUTPUT_SIZE = (960, 960)


def portrait_matte(rgb):
    height, width = rgb.shape[:2]
    low, high = rgb.min(axis=2), rgb.max(axis=2)
    chroma = high - low
    border = np.concatenate((rgb[:8].reshape(-1, 3), rgb[-8:].reshape(-1, 3),
                             rgb[:, :8].reshape(-1, 3), rgb[:, -8:].reshape(-1, 3)))
    paper = border[(border.min(axis=1) > 230) & (np.ptp(border, axis=1) < 16)]
    background = np.median(paper, axis=0).astype(np.float32)

    # These seeds belong to this portrait's face, including its cropped bottom.
    # Bright skin is foreground even where it touches the white backdrop.
    face = np.zeros((height, width), dtype=np.uint8)
    cv2.ellipse(face, (round(width * 700 / 1920), round(height * .8)),
                (round(width * 690 / 1920), round(height * 590 / 1920)),
                0, 0, 360, 1, -1)
    mask = np.full((height, width), cv2.GC_PR_BGD, dtype=np.uint8)
    mask[low < 190] = cv2.GC_PR_FGD
    mask[(low < 130) | (face == 1)] = cv2.GC_FGD
    mask[(low > 245) & (chroma < 6) & (face == 0)] = cv2.GC_BGD
    cv2.setRNGSeed(0)
    cv2.grabCut(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), mask, None,
                np.zeros((1, 65)), np.zeros((1, 65)), 5, cv2.GC_INIT_WITH_MASK)
    silhouette = np.isin(mask, [cv2.GC_FGD, cv2.GC_PR_FGD]).astype(np.uint8)

    # Remove JPEG flecks without shrinking the hair into a hard, eroded edge.
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    silhouette = cv2.morphologyEx(silhouette, cv2.MORPH_OPEN, kernel)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(silhouette, 8)
    kept = [i for i in range(1, count) if stats[i, cv2.CC_STAT_AREA] > 30]
    silhouette = np.isin(labels, kept).astype(np.uint8)

    # Skin highlights can be mistaken for tiny holes. Fill only enclosed specks;
    # the large openings between locks of hair remain transparent.
    count, holes, stats, _ = cv2.connectedComponentsWithStats(1 - silhouette, 8)
    for i in range(1, count):
        x, y, w, h, area = stats[i]
        if area < 512 and x > 0 and y > 0 and x + w < width and y + h < height:
            silhouette[holes == i] = 1

    interior = cv2.erode(silhouette, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))).astype(bool)
    domain = cv2.dilate(silhouette, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))).astype(bool)
    _, nearest = cv2.distanceTransformWithLabels((~interior).astype(np.uint8),
                                                cv2.DIST_L2, cv2.DIST_MASK_5,
                                                labelType=cv2.DIST_LABEL_PIXEL)
    palette = np.zeros((int(nearest.max()) + 1, 3), dtype=np.float32)
    palette[nearest[interior]] = rgb[interior]
    foreground = palette[nearest]

    # Solve C = alpha * F + (1 - alpha) * B in a narrow boundary band.
    # Gaussian-blurring a binary mask leaves white RGB baked into its edge.
    delta = foreground - background
    alpha = np.clip(((rgb.astype(np.float32) - background) * delta).sum(axis=2)
                    / np.maximum((delta * delta).sum(axis=2), 1), 0, 1)
    alpha[interior] = 1
    alpha[~domain] = 0
    alpha[alpha < .03] = 0
    colour = np.clip((rgb.astype(np.float32) - background * (1 - alpha[..., None]))
                     / np.maximum(alpha[..., None], .03), 0, 255)
    return colour, alpha, background


def red_accents(colour):
    r, g, b = colour.transpose(2, 0, 1)
    red = (r > g * 1.55) & (r > b * 1.18) & (r > 120)
    iris_core = (r > 195) & (g < 135) & (b < 150) & (r > g * 1.9)
    height, width = red.shape

    # The eyelashes have a burgundy gradient that crosses the global red
    # threshold. Inside each eye region, keep only its saturated iris component
    # red, so the complete lash remains grayscale instead of breaking into
    # dark and signal-red sections. Coordinates refer to the original portrait.
    for bounds in [(30, 1240, 530, 1645), (820, 1360, 1280, 1770)]:
        x0, y0, x1, y1 = [round(value * (width if index % 2 == 0 else height) / 1920)
                          for index, value in enumerate(bounds)]
        region = iris_core[y0:y1, x0:x1].astype(np.uint8)
        count, labels, stats, _ = cv2.connectedComponentsWithStats(region, 8)
        if count <= 1:
            raise ValueError("No iris found in the portrait's eye region")
        largest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        iris = (labels == largest).astype(np.uint8)
        iris = cv2.dilate(iris, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))).astype(bool)
        red[y0:y1, x0:x1] &= iris & (r[y0:y1, x0:x1] > 185)
    return red


def build():
    rgb = np.asarray(Image.open(ROOT / "public/logo.jpg").convert("RGB"))
    colour, alpha, background = portrait_matte(rgb)
    grey = cv2.cvtColor(colour.astype(np.uint8), cv2.COLOR_RGB2GRAY)
    mono = np.repeat(grey[..., None], 3, axis=2)
    red = red_accents(colour)
    mono[red] = [240, 68, 68]
    mono[alpha == 0] = 0
    subject = Image.fromarray(np.dstack((mono, (alpha * 255).astype(np.uint8))), "RGBA")
    subject = subject.resize(OUTPUT_SIZE, Image.Resampling.LANCZOS)
    # Lossless WebP keeps thin hair and the decontaminated edge intact.
    subject.save(ROOT / "public/portrait-mono.webp", lossless=True, method=6)

    sample = np.asarray(subject)
    pixels = Image.new("RGBA", subject.size)
    draw = ImageDraw.Draw(pixels)
    for y in range(4, OUTPUT_SIZE[1], 7):
        for x in range(4, OUTPUT_SIZE[0], 7):
            r, g, b, opacity = (int(value) for value in sample[y, x])
            if opacity < 100:
                continue
            luminance = (r + g + b) / 3 / 255
            radius = .7 + luminance ** .8 * 2.3
            hot = r > g * 1.7 and r > b * 1.7
            fill = ((240, 68, 68, 235) if hot else
                    (220, 220, 220, int((.14 + luminance * .86) * opacity)))
            draw.rectangle((x - radius, y - radius, x + radius, y + radius), fill=fill)
    pixels.save(ROOT / "public/portrait-pixels.webp", lossless=True, method=6)
    print(json.dumps({"source": "public/logo.jpg", "background": background.tolist(),
                      "foregroundCoverage": round(float((alpha > .06).mean()), 4),
                      "outputSize": OUTPUT_SIZE,
                      "files": {name: (ROOT / "public" / name).stat().st_size for name in
                                ["portrait-mono.webp", "portrait-pixels.webp"]}}))


if __name__ == "__main__":
    build()
