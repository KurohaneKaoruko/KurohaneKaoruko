import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-background/60">
      <div className="tech-ruler-h opacity-40" />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-center font-mono text-xs tracking-widest text-text-dim">
          <span className="text-primary">$</span> echo{" "}
          <span className="text-foreground">COMPILE THIS WORLD.</span>
        </p>
        <div className="mt-6 flex flex-col items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Kurohane Kaoruko</p>
          <div className="flex items-center gap-5">
            <Link href="/projects" className="transition-colors hover:text-primary">
              Projects
            </Link>
            <Link href="/about" className="transition-colors hover:text-primary">
              About
            </Link>
            <a
              href="https://github.com/KurohaneKaoruko"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-primary"
            >
              GitHub
            </a>
          </div>
          <p>Powered by GitHub Pages</p>
        </div>
      </div>
    </footer>
  );
}
