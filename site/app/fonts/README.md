# Font sources and licenses

All bundled fonts are self-hosted and distributed under **SIL Open Font License 1.1**.
No commercial font files or external font services are used.

| Files | Family | Source | License |
| --- | --- | --- | --- |
| `space-grotesk-variable.woff2` | Space Grotesk, 300–700 | [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/spacegrotesk) | [SPACE-GROTESK-OFL.txt](SPACE-GROTESK-OFL.txt) |
| `ibm-plex-sans-latin.woff2` | IBM Plex Sans, 100–700 | [IBM Plex](https://github.com/IBM/plex) | [IBM-PLEX-OFL.txt](IBM-PLEX-OFL.txt) |
| `ibm-plex-mono-latin-400.woff2`, `ibm-plex-mono-latin-500.woff2` | IBM Plex Mono, 400 / 500 | [IBM Plex](https://github.com/IBM/plex) | [IBM-PLEX-OFL.txt](IBM-PLEX-OFL.txt) |
| `noto-sans-sc-subset.woff2` | Noto Sans SC, 300–900 | [Noto CJK](https://github.com/notofonts/noto-cjk) | [NOTO-SANS-SC-OFL.txt](NOTO-SANS-SC-OFL.txt) |

The Noto font is subset using `scripts/subset-fonts.py`. Its copyright and license
metadata are retained. Space Grotesk is converted from the upstream variable TTF to
WOFF2 without changing its glyphs. Font copyright notices are included in the
license files alongside the distributed font files.
