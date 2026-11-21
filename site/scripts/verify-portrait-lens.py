"""Compare the cursor lens with the pixel and original portrait layers.

Requires Playwright, Chrome, Pillow and NumPy. With a static preview running:
    python scripts/verify-portrait-lens.py --url http://127.0.0.1:4173/
"""

import argparse
import io
import json
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image
from playwright.sync_api import expect, sync_playwright


def capture(portrait):
    data = portrait.screenshot(animations="disabled")
    return np.asarray(Image.open(io.BytesIO(data)).convert("RGB")), data


def check_iris_shading(page, portrait, pixels):
    # Compare both eyes with the same rendered portrait after removing the fade.
    style = page.add_style_tag(content=".folio-portrait::after{visibility:hidden!important}")
    unshaded, _ = capture(portrait)
    style.evaluate("el => el.remove()")
    height, width = pixels.shape[:2]
    for left, top, right, bottom in [(.105, .685, .22, .844), (.445, .746, .575, .911)]:
        eye = np.s_[round(height * top):round(height * bottom),
                    round(width * left):round(width * right)]
        reference = unshaded[eye].astype(int)
        assert np.count_nonzero(reference[..., 0] > reference[..., 1] + 50) > 100
        difference = np.abs(pixels[eye].astype(int) - reference).max()
        assert difference <= 2, f"The fade is shading the iris at x={left}: {difference}"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default="http://127.0.0.1:4173/")
    parser.add_argument("--output", type=Path)
    options = parser.parse_args()
    output = options.output or Path(tempfile.gettempdir()) / "opencode" / "portrait-lens"
    output.mkdir(parents=True, exist_ok=True)
    results = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        for width, scale in [(1440, 1), (1440, 2), (1920, 2)]:
            page = browser.new_page(viewport={"width": width, "height": 1100}, device_scale_factor=scale)
            page.route("https://api.github.com/**", lambda route: route.abort())
            page.goto(options.url, wait_until="load")
            page.evaluate("document.fonts.ready")
            page.locator(".splash-root").wait_for(state="hidden")
            portrait = page.locator(".folio-portrait")
            expect(portrait.get_by_role("button")).to_have_count(0)
            original = portrait.locator(".portrait-original")
            original.evaluate("el => el.decode()")
            portrait.locator(".portrait-pixels").evaluate("el => el.decode()")

            page.mouse.move(0, 0)
            pixels, _ = capture(portrait)
            check_iris_shading(page, portrait, pixels)
            hidden = page.add_style_tag(content=".portrait-pixels-layer,.portrait-lens{visibility:hidden!important}")
            empty, _ = capture(portrait)
            hidden.evaluate("el => el.remove()")
            # Reveal the unmasked original for the reference screenshot only.
            reference = page.add_style_tag(content=(
                ".portrait-pixels-layer{visibility:hidden!important}"
                ".portrait-lens{opacity:1!important;clip-path:none!important}"
            ))
            full, _ = capture(portrait)
            reference.evaluate("el => el.remove()")

            box = portrait.bounding_box()
            height, image_width = pixels.shape[:2]
            sx, sy = image_width / box["width"], height / box["height"]
            yy, xx = np.indices((height, image_width))
            for index, (u, v) in enumerate([(.78, .42), (.9, .53), (.16, .76), (.51, .83)]):
                page.mouse.move(box["x"] + box["width"] * u,
                                box["y"] + box["height"] * v)
                expect(portrait).to_have_attribute("data-inspecting", "true")
                actual, data = capture(portrait)
                distance = np.hypot((xx + .5) / sx - box["width"] * u,
                                    (yy + .5) / sy - box["height"] * v)
                inside = distance < 101
                outside = distance > 109
                inner_diff = np.abs(actual.astype(int) - full.astype(int)).max(axis=2)
                outer_diff = np.abs(actual.astype(int) - pixels.astype(int)).max(axis=2)
                inner_errors = int(np.count_nonzero((inner_diff > 1) & inside))
                # Chrome's mask compositing can round a channel by 2/255 at
                # unchanged pixels. Detect visual changes above that measured
                # rounding floor; the hidden-circle assertion stays strict.
                outer_errors = int(np.count_nonzero((outer_diff > 2) & outside))

                # Remove the original image to prove the pixels are actually
                # masked out, rather than merely covered by an opaque surface.
                hidden = page.add_style_tag(content=".portrait-original{visibility:hidden!important}")
                pixels_only, _ = capture(portrait)
                hidden.evaluate("el => el.remove()")
                hole_diff = np.abs(pixels_only.astype(int) - empty.astype(int)).max(axis=2)
                hole_errors = int(np.count_nonzero((hole_diff > 1) & (distance < 104)))
                if index == 0:
                    # A broken copy with the cutout disabled must fail the same
                    # pixel check, even though the original image is hidden.
                    broken_style = page.add_style_tag(content=(
                        ".portrait-original{visibility:hidden!important}"
                        ".portrait-pixels-layer{-webkit-mask-image:none!important;mask-image:none!important}"
                    ))
                    broken, _ = capture(portrait)
                    broken_style.evaluate("el => el.remove()")
                    leaked = np.abs(broken.astype(int) - empty.astype(int)).max(axis=2)
                    assert np.count_nonzero((leaked > 1) & (distance < 104)) > 100
                lens_background = portrait.locator(".portrait-lens").evaluate("el=>getComputedStyle(el).backgroundColor")
                assert lens_background == "rgba(0, 0, 0, 0)", lens_background
                result = {"width": width, "dpr": scale, "position": [u, v],
                          "insideMismatch": inner_errors, "outsideMismatch": outer_errors,
                          "visiblePixelsInsideHole": hole_errors}
                results.append(result)
                if inner_errors or outer_errors:
                    (output / "failed-lens.png").write_bytes(data)
                assert not inner_errors, f"Mosaic visible inside lens: {result}"
                assert not outer_errors, f"Portrait outside lens changed: {result}"
                assert not hole_errors, f"Pixel layer is not hidden inside lens: {result}"
                if width == 1440 and scale == 2 and index == 3:
                    (output / "lens-fixed.png").write_bytes(data)
                    page.screenshot(path=str(output / "desktop-fixed.png"))

            page.emulate_media(reduced_motion="reduce")
            reduced_pixels, _ = capture(portrait)
            assert np.max(np.abs(reduced_pixels.astype(int) - pixels.astype(int))) <= 2
            page.emulate_media(reduced_motion="no-preference")
            page.mouse.move(0, 0)
            restored, _ = capture(portrait)
            assert np.max(np.abs(restored.astype(int) - pixels.astype(int))) <= 2
            page.close()
        browser.close()

    (output / "checks.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(json.dumps({"samples": len(results), "insideMismatch": 0,
                      "outsideMismatch": 0, "visiblePixelsInsideHole": 0,
                      "irisShadingChecks": 6,
                      "pointerLeaveRestored": True,
                      "reducedMotionKeepsPixels": True, "output": str(output)}))


if __name__ == "__main__":
    main()
