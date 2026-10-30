/**
 * 技术栈拓扑图。
 *
 * 每个项目按自己的 topics + 语言画一张节点图：中间是核心，四周是这项技术
 * 实际用到的东西。同一份数据永远得到同一张图 —— 图不是装饰，是项目的一部分。
 */

type Pt = { x: number; y: number };

const SLOTS: Pt[] = [
  { x: 66, y: 54 },
  { x: 176, y: 54 },
  { x: 52, y: 108 },
  { x: 188, y: 108 },
  { x: 120, y: 160 },
];

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => (Math.round(n * 10) / 10).toString();

/** 直角 + 45° 倒角的走线 */
function trace(a: Pt, b: Pt): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) < 2 || Math.abs(dy) < 2) {
    return `M ${f(a.x)} ${f(a.y)} L ${f(b.x)} ${f(b.y)}`;
  }
  const s = Math.sign(dy);
  const dir = Math.sign(dx);
  const c = Math.min(7, Math.abs(dx) / 2, Math.abs(dy) / 2);
  const mid = a.x + dx * 0.55;
  return [
    `M ${f(a.x)} ${f(a.y)}`,
    `H ${f(mid - dir * c)}`,
    `L ${f(mid)} ${f(a.y + s * c)}`,
    `V ${f(b.y - s * c)}`,
    `L ${f(mid + dir * c)} ${f(b.y)}`,
    `H ${f(b.x)}`,
  ].join(" ");
}

export function StackGraph({
  name,
  topics,
  lang,
  className = "",
  animate = false,
  centerLabel,
  includeLang = true,
}: {
  name: string;
  topics: string[];
  lang: string;
  className?: string;
  animate?: boolean;
  /** 中心节点上显示的字；不传则画十字准星 */
  centerLabel?: string;
  /** 是否把语言也画成一个节点 */
  includeLang?: boolean;
}) {
  const rng = mulberry32(hashSeed(name));

  const labels = [...new Set(topics.filter(Boolean))].slice(0, includeLang ? 4 : 5);
  if (includeLang && lang && !labels.some((t) => t.toLowerCase() === lang.toLowerCase())) {
    labels.push(lang);
  }
  const nodes = labels.slice(0, 5);

  const slots =
    nodes.length <= 1
      ? [SLOTS[3]]
      : nodes.length === 2
        ? [SLOTS[2], SLOTS[3]]
        : nodes.length === 3
          ? [SLOTS[0], SLOTS[1], SLOTS[4]]
          : nodes.length === 4
            ? [SLOTS[0], SLOTS[1], SLOTS[2], SLOTS[4]]
            : SLOTS;

  const center: Pt = { x: 120, y: 102 };

  const items = nodes.map((label, i) => {
    const slot = slots[i];
    const text = label.length > 15 ? label.slice(0, 14) + "…" : label;
    const width = Math.min(96, Math.max(32, text.length * 5.1 + 12));
    const jitterX = (rng() - 0.5) * 4;
    const jitterY = (rng() - 0.5) * 4;
    const p = { x: slot.x + jitterX, y: slot.y + jitterY };
    const left = Math.max(16, Math.min(224 - width, p.x - width / 2));
    return { label: text, p, width, left, top: p.y - 8.5, trace: trace(center, p) };
  });

  return (
    <svg
      viewBox="0 0 240 200"
      className={(className ?? "") + (animate ? " draw" : "")}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      {/* 外框与刻度 */}
      <rect x="12" y="12" width="216" height="176" pathLength={1} stroke="currentColor" strokeWidth="0.5" opacity="0.28" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
        <line
          key={"t" + k}
          x1={30 + k * 22}
          y1={182}
          x2={30 + k * 22}
          y2={k % 3 === 0 ? 187 : 185}
          pathLength={1}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.35"
        />
      ))}

      {/* 走线 */}
      {items.map((item, i) => (
        <path
          key={"trace" + i}
          d={item.trace}
          pathLength={1}
          stroke={i === 0 ? "var(--signal)" : "currentColor"}
          strokeWidth={i === 0 ? 0.9 : 0.65}
          opacity={i === 0 ? 1 : 0.6}
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}

      {/* 节点 */}
      {items.map((item, i) => (
        <g key={"node" + i}>
          <rect
            x={item.left}
            y={item.top}
            width={item.width}
            height={17}
            pathLength={1}
            fill="var(--bg-2)"
            stroke="currentColor"
            strokeWidth="0.7"
            opacity="0.95"
          />
          <text
            x={item.left + 6}
            y={item.top + 11.4}
            fontSize="7"
            letterSpacing="0.08em"
            fill="currentColor"
            stroke="none"
            opacity="0.85"
            style={{ fontFamily: "var(--stack-mono)", textTransform: "uppercase" }}
          >
            {item.label.toUpperCase()}
          </text>
        </g>
      ))}

      {/* 核心 */}
      <rect
        x={center.x - 17}
        y={center.y - 11}
        width="34"
        height="22"
        pathLength={1}
        fill="var(--bg-2)"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      {centerLabel ? (
        <text
          x={center.x}
          y={center.y + 2.2}
          textAnchor="middle"
          fontSize="5.4"
          letterSpacing="0.08em"
          fill="currentColor"
          stroke="none"
          style={{ fontFamily: "var(--stack-mono)" }}
        >
          {centerLabel.toUpperCase()}
        </text>
      ) : (
        <>
          <line x1={center.x - 5} y1={center.y} x2={center.x + 5} y2={center.y} pathLength={1} stroke="currentColor" strokeWidth="0.6" />
          <line x1={center.x} y1={center.y - 5} x2={center.x} y2={center.y + 5} pathLength={1} stroke="currentColor" strokeWidth="0.6" />
        </>
      )}
      <circle cx={center.x + 10} cy={center.y - 8} r="1.4" pathLength={1} fill="var(--signal)" stroke="none" />

      {/* 十字准星 */}
      <g opacity="0.35" stroke="currentColor" strokeWidth="0.5">
        <line x1="196" y1="150" x2="206" y2="150" pathLength={1} />
        <line x1="201" y1="145" x2="201" y2="155" pathLength={1} />
        <circle cx="201" cy="150" r="6" pathLength={1} />
      </g>
    </svg>
  );
}
