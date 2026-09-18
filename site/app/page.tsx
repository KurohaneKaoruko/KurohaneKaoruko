import TypingText from "@/components/TypingText";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/Button";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { marqueeTech, projects, typingLines } from "@/lib/data";

const featured = [...projects].sort((a, b) => b.stars - a.stars).slice(0, 6);

const stats = [
  { value: "12+", label: "REPOS / 开源仓库" },
  { value: "42", label: "STARS / 星标收获" },
  { value: "03", label: "LANGS / 主力语言" },
  { value: "∞", label: "CURIOSITY / 好奇心" },
];

const termLines = [
  { cmd: "whoami", out: "kurohane-kaoruko — AI engineer & toolmaker" },
  { cmd: "cat focus.txt", out: "LLM Agents · Swarm Intelligence · Dev Tools · Games" },
  { cmd: "sudo make world", out: "[OK] compiling..." },
];

export default function Home() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <p className="fade-in-up font-mono text-[11px] tracking-[0.3em] text-text-muted sm:text-xs">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse bg-primary align-middle" />
            SYS.ONLINE // PORTFOLIO_KERNEL v2.1 //{" "}
            <ScrambleText text="ACCESS GRANTED" className="text-primary" duration={900} delay={600} />
          </p>

          <h1
            className="fade-in-up mt-8 font-mono text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl"
            style={{ animationDelay: "0.1s" }}
          >
            KUROHANE KAORUKO
          </h1>

          <div
            className="fade-in-up mt-6 font-mono text-base text-text-muted sm:text-xl"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="text-primary">❯</span> <TypingText lines={typingLines} />
          </div>

          <p
            className="fade-in-up mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base"
            style={{ animationDelay: "0.3s" }}
          >
            专注于人工智能领域，致力于用技术解决问题。
            <br />
            偶尔写一些小工具，或者是有趣、好玩的项目。
          </p>

          <div
            className="fade-in-up mt-10 flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: "0.4s" }}
          >
            <Button href="/projects" variant="primary" shape="chamfer">
              进入项目库
            </Button>
            <Button href="https://github.com/KurohaneKaoruko" variant="tech">
              GitHub ↗
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce font-mono text-primary">
          ▼
        </div>
      </section>

      <Marquee items={marqueeTech} />

      {/* ===== STATS ===== */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="tech-corners border border-border bg-card-bg/70 p-6 text-center transition-colors hover:border-active">
                <p className="font-mono text-4xl font-bold text-primary">{s.value}</p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== FEATURED ===== */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-dim">
                {"// featured_projects"}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">精选项目</h2>
            </div>
            <a
              href="/projects"
              className="hidden font-mono text-xs uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-primary sm:block"
            >
              全部仓库 →
            </a>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== TERMINAL ===== */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <Reveal>
          <div className="tech-corners border border-border bg-card-bg/70 p-6 font-mono text-xs leading-7 sm:p-8 sm:text-sm">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3 text-[10px] uppercase tracking-[0.3em] text-text-dim">
              <span>kurohane@portfolio:~</span>
              <span>bash — 80×24</span>
            </div>
            {termLines.map((t, i) => (
              <div key={t.cmd} className="fade-in-up" style={{ animationDelay: `${0.5 + i * 0.35}s` }}>
                <p>
                  <span className="text-primary">❯</span>{" "}
                  <span className="text-foreground">{t.cmd}</span>
                </p>
                <p className="text-text-muted">{t.out}</p>
              </div>
            ))}
            <p className="fade-in-up" style={{ animationDelay: "1.6s" }}>
              <span className="text-primary">❯</span>{" "}
              <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-primary" />
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
