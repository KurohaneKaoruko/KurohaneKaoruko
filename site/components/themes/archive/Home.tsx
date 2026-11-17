import Link from "next/link";
import { Collection } from "@/components/collection/Collection";
import { Hero } from "./Hero";
import { Featured } from "./Featured";
import { FieldData } from "./FieldData";
import { SectionRail } from "@/components/home/SectionRail";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { Ticker } from "@/components/ui/Ticker";
import { projects } from "@/lib/data";

/** 原版档案首页：独立组件树与样式，保留原有排版、图版和交互。 */
export default function ArchiveHome() {
  return (
    <>
      <Hero />
      <SectionRail />
      <Ticker items={projects.map((project) => project.name)} />
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
            <Collection mode="home" limit={8} subtitle="taxon" />
          </Reveal>
        </div>
      </section>
      <FieldData />
    </>
  );
}
