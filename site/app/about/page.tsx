import type { Metadata } from "next";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = { title: "关于 / ABOUT" };

const skillGroups = [
  { title: "LANGUAGES", items: ["TypeScript", "Python", "Rust", "JavaScript"] },
  { title: "AI & AGENTS", items: ["LLM Agents", "Swarm Intelligence", "RAG", "GAN / DCGAN"] },
  { title: "FRAMEWORK & TOOLS", items: ["Next.js", "React", "Tauri", "Node.js", "Git"] },
];

const now = [
  { name: "ExMachina", text: "构建以集体智能与集群协作为核心的 Agent 系统" },
  { name: "DSH-Novel", text: "让 DeepSeek Harness 变成 AI 写小说的工作区" },
  { name: "Rosemary-Maidcafe", text: "用 Tauri + Next.js 做女仆咖啡厅经营游戏" },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-dim">{"// about"}</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">关于我</h1>
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="tech-corners h-full border border-border bg-card-bg/70 p-8">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">PROFILE</h2>
            <p className="mt-5 leading-relaxed text-text-muted">
              专注于人工智能领域，致力于用技术解决问题。偶尔写一些小工具，或者是有趣、好玩的项目
              —— 从 AI Agent 系统到模拟经营游戏，从开发者工具到深度学习实验。
            </p>
            <p className="mt-4 leading-relaxed text-text-muted">
              相信长期主义与开源精神，喜欢用 Rust / Python / TypeScript 把想法变成现实。
            </p>
            <p className="mt-6 font-mono text-sm text-primary">&gt; COMPILE THIS WORLD.</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex h-full flex-col gap-6">
            {skillGroups.map((g) => (
              <div key={g.title} className="border border-border bg-card-bg/70 p-5">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-secondary">
                  {g.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <span
                      key={it}
                      className="border border-border px-2.5 py-1 font-mono text-xs text-text-muted transition-colors hover:border-active hover:text-primary"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-6">
        <div className="tech-corners border border-border bg-card-bg/70 p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            NOW — 正在做的事
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {now.map((n) => (
              <div
                key={n.name}
                className="border border-border bg-background/60 p-5 transition-colors hover:border-active"
              >
                <p className="font-mono text-sm text-secondary">{n.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-6">
        <div className="border border-border bg-card-bg/70 p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            GITHUB INSIGHTS
          </h2>
          <p className="mt-1 font-mono text-[11px] text-text-dim">
            {"// 与个人主页 README 同源的数据卡片"}
          </p>
          <div className="mt-6 flex justify-center">
            <img
              src="https://streak-stats.demolab.com?user=KurohaneKaoruko&amp;theme=transparent&amp;hide_border=true"
              alt="GitHub streak"
              className="w-full max-w-2xl"
            />
          </div>
          <div className="mt-4 grid grid-cols-1 items-start justify-items-center gap-4 sm:grid-cols-2">
            <img
              src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=KurohaneKaoruko&amp;theme=transparent"
              alt="Repos per language"
              className="w-full max-w-md"
            />
            <img
              src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=KurohaneKaoruko&amp;theme=transparent"
              alt="Most commit language"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
