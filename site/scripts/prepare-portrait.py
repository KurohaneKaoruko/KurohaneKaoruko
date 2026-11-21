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
PIXEL_STEP = 7
SIGNAL_RED = (240, 68, 68)
IRIS_LUMINANCE = sum(SIGNAL_RED) / (3 * 255)


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


def iris_matte(colour, core):
    """Separate the iris from the adjacent skin and lash pixels."""
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    interior = cv2.erode(core, kernel).astype(bool)
    band = cv2.dilate(core, kernel)
    exterior = band == 0
    _, nearest = cv2.distanceTransformWithLabels(
        band, cv2.DIST_L2, cv2.DIST_MASK_5, labelType=cv2.DIST_LABEL_PIXEL
    )
    palette = np.zeros((int(nearest.max()) + 1, 3), dtype=np.float32)
    palette[nearest[exterior]] = colour[exterior]
    surround = palette[nearest]
    iris_colour = np.median(colour[interior], axis=0)
    delta = iris_colour - surround
    coverage = np.clip(
        ((colour - surround) * delta).sum(axis=2) / np.maximum((delta * delta).sum(axis=2), 1),
        0, 1,
    )
    coverage[interior] = 1
    coverage[exterior] = 0
    surround_luminance = cv2.cvtColor(surround, cv2.COLOR_RGB2GRAY) / 255
    return coverage, surround_luminance * (1 - coverage)


def red_accents(colour, greyscale):
    r, g, b = colour.transpose(2, 0, 1)
    red = (r > g * 1.55) & (r > b * 1.18) & (r > 120)
    iris_core = (r > 195) & (g < 135) & (b < 150) & (r > g * 1.9)
    height, width = red.shape
    irises = np.zeros_like(greyscale)
    neutral = greyscale.copy()

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
        core = (labels == largest).astype(np.uint8)
        coverage, surround = iris_matte(colour[y0:y1, x0:x1], core)
        red[y0:y1, x0:x1] = False
        irises[y0:y1, x0:x1] = coverage
        neutral[y0:y1, x0:x1] = np.where(
            coverage > 0, surround, greyscale[y0:y1, x0:x1]
        )
    return red, irises, neutral


def blush_accent(colour):
    """Return the original soft-pink cheek blush, separate from scarlet irises."""
    height, width = colour.shape[:2]
    red, green, blue = colour.astype(np.float32).transpose(2, 0, 1)
    result = np.zeros((height, width), dtype=np.float32)
    # Select the existing cheek paint by colour inside its own local bounds.
    # This keeps the original gradients and darker blush marks rather than
    # drawing a new ellipse or repainting the cheeks with the signal red.
    pinkness = np.minimum(red - green, red - blue)
    pink = (red > 232) & (green > 165) & (blue > 165) & (green - blue < 32)
    weight = np.clip((pinkness - 12) / 8, 0, 1) * pink
    for bounds in [(88, 1608, 327, 1777), (889, 1744, 1125, 1910)]:
        x0, y0, x1, y1 = [
            round(value * (width if i % 2 == 0 else height) / 1920)
            for i, value in enumerate(bounds)
        ]
        result[y0:y1, x0:x1] = weight[y0:y1, x0:x1]
    return result


def iris_tile(average, center_iris, center_grey, opacity, tint):
    coverage, neutral_luminance = map(float, average)
    if center_iris < .5 and center_grey < .44:
        # The centre is on the eyelash. Keep that tile neutral.
        return (220, 220, 220, int((.14 + .86 * center_grey) * opacity)), center_grey

    # Let each pixel tile take the colour of its dominant surface.
    if coverage >= .5:
        return (*SIGNAL_RED, 235), IRIS_LUMINANCE

    # Use only the surrounding light so the neutral edge keeps its full size.
    luminance = min(1, neutral_luminance / (1 - coverage))
    return (*tint, int((.14 + .86 * luminance) * opacity)), luminance


def build():
    rgb = np.asarray(Image.open(ROOT / "public/logo.jpg").convert("RGB"))
    colour, alpha, background = portrait_matte(rgb)
    grey = cv2.cvtColor(colour.astype(np.uint8), cv2.COLOR_RGB2GRAY)
    mono = np.repeat(grey[..., None], 3, axis=2).astype(np.float32)
    greyscale = grey.astype(np.float32) / 255
    red, irises, neutral = red_accents(colour, greyscale)
    iris = irises > 0
    mono[iris] = neutral[iris, None] * 255 + irises[iris, None] * SIGNAL_RED
    mono[red] = SIGNAL_RED
    mono[alpha == 0] = 0
    # Tile geometry still comes from the same grayscale/red portrait as before.
    # Restoring cheek colour must not change the point sizes or opacity.
    base_subject = Image.fromarray(
        np.dstack((mono.astype(np.uint8), (alpha * 255).astype(np.uint8))), "RGBA"
    ).resize(OUTPUT_SIZE, Image.Resampling.LANCZOS)
    blush = blush_accent(rgb)
    blush_weight = (blush * (1 - irises))[..., None]
    mono = mono * (1 - blush_weight) + colour * blush_weight
    mono = np.clip(mono, 0, 255).astype(np.uint8)
    mono[red] = SIGNAL_RED
    mono[alpha == 0] = 0
    subject = Image.fromarray(np.dstack((mono, (alpha * 255).astype(np.uint8))), "RGBA")
    subject = subject.resize(OUTPUT_SIZE, Image.Resampling.LANCZOS)
    # Lossless WebP keeps thin hair and the decontaminated edge intact.
    subject.save(ROOT / "public/portrait-mono.webp", lossless=True, method=6)

    sample = np.asarray(subject)
    base_sample = np.asarray(base_subject)
    pixel_blush = np.asarray(Image.fromarray(blush, "F").resize(OUTPUT_SIZE, Image.Resampling.BILINEAR))
    # Sample iris coverage and neutral light with a non-ringing area filter.
    iris_source = np.dstack((irises, neutral))
    iris_sample = cv2.resize(iris_source, OUTPUT_SIZE, interpolation=cv2.INTER_AREA)
    iris_tiles = cv2.blur(iris_sample, (PIXEL_STEP, PIXEL_STEP))
    pixel_grey = cv2.resize(greyscale, OUTPUT_SIZE, interpolation=cv2.INTER_AREA)
    pixels = Image.new("RGBA", subject.size)
    draw = ImageDraw.Draw(pixels)
    for y in range(4, OUTPUT_SIZE[1], PIXEL_STEP):
        for x in range(4, OUTPUT_SIZE[0], PIXEL_STEP):
            r, g, b, opacity = (int(value) for value in base_sample[y, x])
            if opacity < 100:
                continue
            luminance = (r + g + b) / 3 / 255
            hot = r > g * 1.7 and r > b * 1.7
            # Tint existing tiles without changing their opacity, size or grid.
            strength = float(pixel_blush[y, x])
            tint = tuple(round(220 * (1 - strength) + int(channel) * strength) for channel in sample[y, x, :3])
            fill = ((*SIGNAL_RED, 235) if hot else
                    (*tint, int((.14 + luminance * .86) * opacity)))
            if iris_tiles[y, x, 0] > 0:
                fill, luminance = iris_tile(
                    iris_tiles[y, x], iris_sample[y, x, 0],
                    float(pixel_grey[y, x]), opacity, tint,
                )
            radius = .7 + luminance ** .8 * 2.3
            draw.rectangle((x - radius, y - radius, x + radius, y + radius), fill=fill)
    pixels.save(ROOT / "public/portrait-pixels.webp", lossless=True, method=6)
    blush_pixels = int(np.count_nonzero((blush > 0) & (alpha > .06)))
    if blush_pixels < 100:
        raise RuntimeError(f"Portrait blush mask is unexpectedly small: {blush_pixels}px")
    print(json.dumps({"source": "public/logo.jpg", "background": background.tolist(),
                      "foregroundCoverage": round(float((alpha > .06).mean()), 4),
                      "softBlushPixels": blush_pixels,
                      "outputSize": OUTPUT_SIZE,
                      "files": {name: (ROOT / "public" / name).stat().st_size for name in
                                ["portrait-mono.webp", "portrait-pixels.webp"]}}))


if __name__ == "__main__":
    build()
