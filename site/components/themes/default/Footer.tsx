import Link from "next/link";
import { BASE, SITE } from "@/lib/site";

export function DefaultFooter() {
  return (
    <footer className="folio-footer" id="contact">
      <div className="folio-footer-top">
        <span className="folio-caption">
          <i /> GET IN TOUCH
        </span>
        <span className="folio-caption">CHINA / UTC+8</span>
      </div>
      <a className="folio-footer-title" href={`mailto:${SITE.email}`}>
        Let’s talk<span aria-hidden="true">↗</span>
      </a>
      <div className="folio-footer-links">
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        <a href={SITE.github} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
        <Link href="/about/">About ↗</Link>
        <Link href="/themes/">Themes ↗</Link>
      </div>
      <details className="folio-font-notices">
        <summary>开源字体与许可证</summary>
        <div>
          <a href={`${BASE}/licenses/fonts/SPACE-GROTESK-OFL.txt`}>
            Space Grotesk / SIL OFL 1.1 ↗
          </a>
          <a href={`${BASE}/licenses/fonts/IBM-PLEX-OFL.txt`}>
            IBM Plex Sans & Mono / SIL OFL 1.1 ↗
          </a>
          <a href={`${BASE}/licenses/fonts/NOTO-SANS-SC-OFL.txt`}>
            Noto Sans SC / SIL OFL 1.1 ↗
          </a>
        </div>
      </details>
      <div className="folio-footer-bottom">
        <span>© {new Date().getFullYear()} KUROHANE KAORUKO</span>
        <a href="#top">BACK TO TOP ↑</a>
      </div>
    </footer>
  );
}
