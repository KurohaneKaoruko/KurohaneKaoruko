import { Portrait } from "./Portrait";
import { SITE } from "@/lib/site";
import { ProjectName } from "@/components/ProjectName";

export function Hero() {
  return (
    <section
      className="personal-hero"
      id="hero"
      aria-labelledby="personal-title"
    >
      <div className="personal-hero-topline">
        <span>
          INDEPENDENT DEVELOPER <i /> CHINA · UTC+8
        </span>
        <span>PERSONAL PORTFOLIO / 2026</span>
      </div>
      <div className="personal-hero-grid">
        <Portrait />
        <div className="personal-hero-copy">
          <p className="personal-hero-kicker">HELLO, I’M</p>
          <h1 id="personal-title">
            <span>Kurohane</span>
            <span>
              Kaoruko<span className="personal-title-dot">.</span>
            </span>
          </h1>
          <div className="personal-hero-bottom">
            <p className="personal-now">
              CURRENTLY BUILDING
              <br />
              <strong>
                <ProjectName name="Iris-Creation" /> <span>×</span>{" "}
                <ProjectName name="ExMachina" />
              </strong>
            </p>
            <a href="#selected" className="personal-scroll">
              <span>探索作品</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
      <div className="personal-hero-index" aria-label="作品类别">
        <a href="#project-exmachina">AI AGENTS</a>
        <a href="#project-iris">DESKTOP TOOLS</a>
        <a href="#project-space">EXPERIMENTS</a>
        <a href={SITE.github} target="_blank" rel="noreferrer">
          OPEN SOURCE <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
