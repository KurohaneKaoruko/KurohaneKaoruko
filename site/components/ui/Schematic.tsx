/**
 * 程序化系统图。
 *
 * 每个仓库名喂进一个确定性随机源，长出一张固定的技术图版：芯片引脚与走线、
 * 节点网络、或者一段波形。同一份数据永远得到同一张图，不同仓库之间又各不相同。
 *
 * 画法是工程制图：0.75px 细线、45° 折角、刻度、十字准星、极小的标注。
 * 全部由 SVG 生成，不依赖任何图片。
 */

type Pt = { x: number; y: number };
type Variant = "chip" | "network" | "wave";

const f = (n: number) => (Math.round(n * 10) / 10).toString();

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

const range = (rng: () => number, min: number, max: number) => min + rng() * (max - min);

/** 带 45° 倒角的直角走线 */
function trace(a: Pt, b: Pt): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) < 1 || Math.abs(dy) < 1) {
    return `M ${f(a.x)} ${f(a.y)} L ${f(b.x)} ${f(b.y)}`;
  }
  const s = Math.sign(dy);
  const dir = Math.sign(dx);
  const chamfer = Math.min(8, Math.abs(dx) / 2, Math.abs(dy) / 2);
  const mid = a.x + dx * 0.55;
  return [
    `M ${f(a.x)} ${f(a.y)}`,
    `H ${f(mid - dir * chamfer)}`,
    `L ${f(mid)} ${f(a.y + s * chamfer)}`,
    `V ${f(b.y - s * chamfer)}`,
    `L ${f(mid + dir * chamfer)} ${f(b.y)}`,
    `H ${f(b.x)}`,
  ].join(" ");
}

export function Schematic({
  seed,
  variant,
  className = "",
  animate = false,
  detail = "full",
  accent = true,
}: {
  seed: string;
  variant?: Variant;
  className?: string;
  animate?: boolean;
  detail?: "full" | "mini";
  accent?: boolean;
}) {
  const rng = mulberry32(hashSeed(seed));
  const kind: Variant =
    variant ?? (["chip", "network", "wave"] as Variant[])[Math.floor(rng() * 3) % 3];
  const mini = detail === "mini";

  let i = 0;
  const next = () => ({ "--i": i++ }) as React.CSSProperties;
  const paths: React.ReactNode[] = [];
  const nodes: React.ReactNode[] = [];
  const marks: React.ReactNode[] = [];

  const node = (p: Pt, r = 2.6, hot = false) =>
    nodes.push(
      <g key={"n" + p.x + "-" + p.y}>
        <circle
          cx={p.x}
          cy={p.y}
          r={r}
          pathLength={1}
          fill={hot ? "var(--signal)" : "var(--bg-2)"}
          stroke={hot ? "var(--signal)" : "currentColor"}
          strokeWidth="0.8"
          style={next()}
        />
        {!mini && (
          <line
            x1={p.x - r - 2}
            y1={p.y}
            x2={p.x + r + 2}
            y2={p.y}
            stroke={hot ? "var(--signal)" : "currentColor"}
            strokeWidth="0.5"
            opacity="0.35"
            pathLength={1}
            style={next()}
          />
        )}
      </g>,
    );

  if (kind === "chip") {
    const w = range(rng, 54, 66);
    const h = range(rng, 64, 76);
    const cx = 120 + range(rng, -6, 6);
    const cy = 100 + range(rng, -4, 4);
    const left = cx - w / 2;
    const right = cx + w / 2;
    const top = cy - h / 2;
    const bottom = cy + h / 2;

    paths.push(
      <rect
        key="chip"
        x={left}
        y={top}
        width={w}
        height={h}
        pathLength={1}
        fill="rgba(238,242,239,0.02)"
        stroke="currentColor"
        strokeWidth="0.9"
        style={next()}
      />,
    );
    // 芯片内部的引脚栅格
    for (let k = 0; k < 3; k += 1) {
      paths.push(
        <line
          key={"inner" + k}
          x1={left + 10}
          y1={top + 16 + k * 10}
          x2={right - 10 - k * 8}
          y2={top + 16 + k * 10}
          pathLength={1}
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.5"
          style={next()}
        />,
      );
    }
    paths.push(
      <circle
        key="core"
        cx={left + 12}
        cy={top + 10}
        r="2"
        pathLength={1}
        fill={accent ? "var(--signal)" : "currentColor"}
        stroke="none"
        style={next()}
      />,
    );

    // 四边引脚与走线
    const pinYs = [0.22, 0.42, 0.62, 0.82].map((t) => top + h * t);
    pinYs.forEach((y, k) => {
      paths.push(
        <line
          key={"pl" + k}
          x1={left - 7}
          y1={y}
          x2={left}
          y2={y}
          pathLength={1}
          stroke="currentColor"
          strokeWidth="0.8"
          style={next()}
        />,
      );
      paths.push(
        <line
          key={"pr" + k}
          x1={right}
          y1={y}
          x2={right + 7}
          y2={y}
          pathLength={1}
          stroke="currentColor"
          strokeWidth="0.8"
          style={next()}
        />,
      );
    });

    const leftNodes = [
      { x: range(rng, 26, 48), y: range(rng, 40, 78) },
      { x: range(rng, 24, 50), y: range(rng, 118, 156) },
    ];
    const rightNodes = [
      { x: range(rng, 192, 216), y: range(rng, 38, 80) },
      { x: range(rng, 190, 214), y: range(rng, 120, 160) },
    ];

    paths.push(
      <path
        key="tl0"
        d={trace({ x: left - 7, y: pinYs[1] }, leftNodes[0])}
        pathLength={1}
        stroke="currentColor"
        strokeWidth="0.7"
        style={next()}
      />,
    );
    paths.push(
      <path
        key="tl1"
        d={trace({ x: left - 7, y: pinYs[3] }, leftNodes[1])}
        pathLength={1}
        stroke="currentColor"
        strokeWidth="0.7"
        style={next()}
      />,
    );
    paths.push(
      <path
        key="tr0"
        d={trace({ x: right + 7, y: pinYs[0] }, rightNodes[0])}
        pathLength={1}
        stroke="currentColor"
        strokeWidth="0.7"
        style={next()}
      />,
    );
    paths.push(
      <path
        key="tr1"
        d={trace({ x: right + 7, y: pinYs[2] }, rightNodes[1])}
        pathLength={1}
        stroke={accent ? "var(--signal)" : "currentColor"}
        strokeWidth="0.8"
        style={next()}
      />,
    );

    leftNodes.forEach((p, k) => node(p, 2.4, false));
    rightNodes.forEach((p, k) => node(p, 2.4, k === 1 && accent));

    // 顶部与底部引线
    paths.push(
      <path
        key="top"
        d={`M ${f(cx - 10)} ${f(top)} V ${f(top - 18)} H ${f(cx + 26)} V ${f(top - 30)}`}
        pathLength={1}
        stroke="currentColor"
        strokeWidth="0.7"
        style={next()}
      />,
    );
    node({ x: cx + 26, y: top - 30 }, 2.2, false);

    // 尺寸标注
    if (!mini) {
      marks.push(
        <g key="dim" stroke="currentColor" strokeWidth="0.5" opacity="0.45">
          <line x1={left} y1={bottom + 12} x2={right} y2={bottom + 12} pathLength={1} />
          <line x1={left} y1={bottom + 8} x2={left} y2={bottom + 16} pathLength={1} />
          <line x1={right} y1={bottom + 8} x2={right} y2={bottom + 16} pathLength={1} />
          <text
            x={cx}
            y={bottom + 21}
            textAnchor="middle"
            fontSize="4.6"
            fill="currentColor"
            stroke="none"
            style={{ fontFamily: "var(--stack-mono)", letterSpacing: "0.1em" }}
          >
            {f(w)}
          </text>
        </g>,
      );
    }
  }

  if (kind === "network") {
    const cols = [34, 78, 122, 166, 206];
    const rows = [44, 82, 120, 158];
    const pts: Pt[] = [];
    const count = 6 + Math.floor(rng() * 3);
    for (let k = 0; k < count; k += 1) {
      const gx = cols[Math.floor(rng() * cols.length) % cols.length];
      const gy = rows[Math.floor(rng() * rows.length) % rows.length];
      if (!pts.some((p) => Math.abs(p.x - gx) < 8 && Math.abs(p.y - gy) < 8)) {
        pts.push({ x: gx, y: gy });
      }
    }
    pts.sort((a, b) => a.x - b.x);

    for (let k = 1; k < pts.length; k += 1) {
      const a = pts[k - 1];
      const b = pts[k];
      paths.push(
        <path
          key={"t" + k}
          d={trace(a, b)}
          pathLength={1}
          stroke={k === 2 && accent ? "var(--signal)" : "currentColor"}
          strokeWidth={k === 2 && accent ? 0.9 : 0.65}
          opacity={k === 2 && accent ? 1 : 0.8}
          style={next()}
        />,
      );
    }
    if (pts.length > 3) {
      paths.push(
        <path
          key="t-extra"
          d={trace(pts[1], pts[pts.length - 1])}
          pathLength={1}
          stroke="currentColor"
          strokeWidth="0.55"
          opacity="0.45"
          style={next()}
        />,
      );
    }
    pts.forEach((p, k) => node(p, k === 2 ? 3.4 : 2.4, k === 2 && accent));

    if (!mini) {
      marks.push(
        <rect
          key="bbox"
          x="22"
          y="28"
          width="196"
          height="148"
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          strokeDasharray="2 4"
          opacity="0.3"
        />,
      );
    }
  }

  if (kind === "wave") {
    const x0 = 28;
    const x1 = 212;
    const mid = 118;
    const amp = range(rng, 26, 40);

    paths.push(
      <line
        key="axis"
        x1={x0}
        y1={mid}
        x2={x1}
        y2={mid}
        pathLength={1}
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.5"
        style={next()}
      />,
    );
    paths.push(
      <line
        key="axis-y"
        x1={x0}
        y1={52}
        x2={x0}
        y2={168}
        pathLength={1}
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.5"
        style={next()}
      />,
    );

    // 波形
    const points: Pt[] = [];
    const steps = 18;
    let y = mid;
    for (let k = 0; k <= steps; k += 1) {
      const t = k / steps;
      y += range(rng, -1, 1) * (amp / 2.6);
      y = Math.max(mid - amp, Math.min(mid + amp, y));
      points.push({ x: x0 + (x1 - x0) * t, y });
    }
    paths.push(
      <polyline
        key="wave"
        points={points.map((p) => `${f(p.x)},${f(p.y)}`).join(" ")}
        pathLength={1}
        fill="none"
        stroke={accent ? "var(--signal)" : "currentColor"}
        strokeWidth="1"
        strokeLinejoin="round"
        style={next()}
      />,
    );

    // 采样刻度
    for (let k = 1; k < 6; k += 1) {
      const x = x0 + ((x1 - x0) / 6) * k;
      paths.push(
        <line
          key={"tick" + k}
          x1={x}
          y1={mid - 3}
          x2={x}
          y2={mid + 3}
          pathLength={1}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.5"
          style={next()}
        />,
      );
      if (!mini) {
        marks.push(
          <line
            key={"vline" + k}
            x1={x}
            y1={52}
            x2={x}
            y2={168}
            pathLength={1}
            stroke="currentColor"
            strokeWidth="0.3"
            strokeDasharray="1 3"
            opacity="0.22"
          />,
        );
      }
    }

    if (!mini) {
      marks.push(
        <g key="labels" fill="currentColor" stroke="none" opacity="0.5">
          <text
            x={x0 - 6}
            y={mid + 2}
            textAnchor="end"
            fontSize="4.4"
            style={{ fontFamily: "var(--stack-mono)" }}
          >
            0
          </text>
          <text
            x={x1}
            y={mid + 12}
            textAnchor="end"
            fontSize="4.4"
            style={{ fontFamily: "var(--stack-mono)" }}
          >
            t
          </text>
          <text
            x={x0}
            y={46}
            fontSize="4.4"
            style={{ fontFamily: "var(--stack-mono)", letterSpacing: "0.12em" }}
          >
            SIG_{seed.replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase()}
          </text>
        </g>,
      );
    }
  }

  // 四角刻度与底部标尺
  const ticks: React.ReactNode[] = [];
  if (!mini) {
    for (let k = 0; k < 13; k += 1) {
      const x = 24 + k * 16;
      ticks.push(
        <line
          key={"bt" + k}
          x1={x}
          y1={182}
          x2={x}
          y2={k % 4 === 0 ? 187 : 185}
          pathLength={1}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.35"
        />,
      );
    }
    ticks.push(
      <line
        key="base"
        x1={24}
        y1={182}
        x2={216}
        y2={182}
        pathLength={1}
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.25"
      />,
    );
  }

  const crossX = range(rng, 40, 200);
  const crossY = range(rng, 40, 160);

  return (
    <svg
      viewBox="0 0 240 200"
      className={(className ?? "") + (animate ? " draw" : "")}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {/* 外框 */}
      <rect
        x="12"
        y="12"
        width="216"
        height="176"
        pathLength={1}
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.28"
        style={next()}
      />

      {paths}
      {nodes}

      {/* 十字准星 */}
      {!mini && (
        <g opacity="0.4" stroke={accent ? "var(--signal)" : "currentColor"} strokeWidth="0.5">
          <line x1={crossX - 5} y1={crossY} x2={crossX + 5} y2={crossY} pathLength={1} />
          <line x1={crossX} y1={crossY - 5} x2={crossX} y2={crossY + 5} pathLength={1} />
          <circle cx={crossX} cy={crossY} r="7" pathLength={1} />
        </g>
      )}

      {marks}
      {ticks}
    </svg>
  );
}

/** 章节之间的分隔符：一条带刻度的短线 */
export function TickRule({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 10"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      aria-hidden="true"
    >
      <line x1="0" y1="5" x2="160" y2="5" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line key={i} x1={i * 22} y1={i % 2 === 0 ? 1 : 3} x2={i * 22} y2={i % 2 === 0 ? 9 : 7} />
      ))}
    </svg>
  );
}
