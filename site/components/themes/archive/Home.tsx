import Link from "next/link";
import { Collection } from "@/components/collection/Collection";
import { Featured } from "@/components/home/Featured";
import { FieldData } from "@/components/home/FieldData";
import { Hero } from "@/components/home/Hero";
import { SectionRail } from "@/components/home/SectionRail";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { Ticker } from "@/components/ui/Ticker";
import { projects } from "@/lib/data";

/** 跑马灯的词条：全部项目名 */
const TICKER = projects.map((p) => p.name);

/**
 * 默认主题「档案」的首页。
 *
 * 保持服务端组件：首屏 HTML 直接带全部内容，不依赖水合，也不进
 * 主题的懒加载包。其他主题由 ThemedHome 在客户端按需替换这棵树。
 */
export default function ArchiveHome() {
  return (
    <>
      <Hero />

      <SectionRail />

      <Ticker items={TICKER} />

      <Featured />

      <section id="collection" className="section border-t border-line">
        <div className="shell">
          <Reveal>
            <SectionHead
              index="02"
              en="Project index"
              cn="全部项目"
              action={
                <Link
                  href="/projects/"
                  className="link font-mono text-[10px] uppercase tracking-[0.18em] text-fg"
                >
                  VIEW ALL →
                </Link>
              }
            />
          </Reveal>

          <Reveal className="mt-8" delay={50}>
            <Collection mode="home" limit={8} />
          </Reveal>
        </div>
      </section>

      <FieldData />
    </>
  );
}
