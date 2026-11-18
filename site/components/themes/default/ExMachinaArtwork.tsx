"use client";

import { useId, useState, type CSSProperties } from "react";

const NODES = [
  { x: 320, y: 68 },
  { x: 680, y: 68 },
  { x: 855, y: 230 },
  { x: 680, y: 392 },
  { x: 320, y: 392 },
  { x: 145, y: 230 },
];
const HUB = { x: 500, y: 230 };
const MODES = {
  collect: { label: "汇聚", code: "CONVERGE" },
  relay: { label: "接力", code: "RELAY" },
  swarm: { label: "协作", code: "SWARM" },
} as const;
type Mode = keyof typeof MODES;
const MODE_IDS = Object.keys(MODES) as Mode[];

const nodeNumber = (index: number) => String(index + 1).padStart(2, "0");

function segment(from: { x: number; y: number }, to: { x: number; y: number }) {
  return `M${from.x} ${from.y}L${to.x} ${to.y}`;
}

/** A playable conceptual illustration. All signals are local demonstration data. */
export function ExMachinaArtwork({
  name,
  href,
}: {
  name: string;
  href: string;
}) {
  const [mode, setMode] = useState<Mode>("collect");
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [pulse, setPulse] = useState(0);
  const hint = useId();
  const active = hovered ?? focused ?? selected;
  const { code, label } = MODES[mode];
  const edges =
    mode === "collect"
      ? NODES.map((node, i) => ({ d: segment(node, HUB), hot: i === active }))
      : mode === "relay"
        ? NODES.map((node, i) => ({
            d: segment(node, NODES[(i + 1) % NODES.length]),
            hot: i === active || (i + 1) % NODES.length === active,
          }))
        : NODES.flatMap((node, i) =>
            NODES.slice(i + 1).map((other, offset) => ({
              d: segment(node, other),
              hot: i === active || i + offset + 1 === active,
            })),
          );
  const signals =
    mode === "collect"
      ? [
          segment(NODES[selected], HUB),
          ...NODES.filter((_, i) => i !== selected).map((node) =>
            segment(HUB, node),
          ),
        ]
      : mode === "relay"
        ? NODES.map((_, i) =>
            segment(
              NODES[(selected + i) % NODES.length],
              NODES[(selected + i + 1) % NODES.length],
            ),
          )
        : NODES.filter((_, i) => i !== selected).map((node) =>
            segment(NODES[selected], node),
          );

  const send = (index: number) => {
    setSelected(index);
    setPulse((value) => value + 1);
  };

  const arrivalDelay = (index: number) => {
    if (index === selected) return 0;
    if (mode === "collect") return 530;
    if (mode === "swarm") return 250;
    const hop = (index - selected + NODES.length) % NODES.length;
    return (hop - 1) * 175 + 185;
  };

  return (
    <div
      className="exm-art"
      data-mode={mode}
      data-source={selected + 1}
      data-pulse={pulse}
    >
      <div className="exm-art-heading">
        <span>
          COLLECTIVE
          <br />
          INTELLIGENCE.
        </span>
        <div className="exm-modes" role="group" aria-label="信号传递方式">
          {MODE_IDS.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={mode === id}
              onClick={() => {
                setMode(id);
                send(selected);
              }}
            >
              {MODES[id].label}
            </button>
          ))}
        </div>
      </div>
      <div className="exm-art-network">
        <svg
          viewBox="0 0 1000 460"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <g className="exm-art-guides" stroke="currentColor" strokeWidth="1">
            <circle cx="500" cy="230" r="188" strokeDasharray="2 9" />
            <circle cx="500" cy="230" r="112" />
            <path d="M100 230H900M500 25V435" strokeDasharray="2 9" />
          </g>
          <g className="exm-art-edges" stroke="currentColor" strokeWidth="1.3">
            {edges.map((edge, i) => (
              <path key={`${mode}-${i}`} d={edge.d} data-active={edge.hot} />
            ))}
          </g>
          {pulse > 0 && (
            <g
              key={pulse}
              className="exm-signals"
              stroke="var(--signal)"
              strokeWidth="2.5"
              fill="none"
            >
              {signals.map((path, i) => (
                <path
                  key={i}
                  d={path}
                  pathLength={1}
                  strokeLinecap="round"
                  style={
                    {
                      "--signal-delay": `${mode === "relay" ? i * 175 : mode === "collect" && i > 0 ? 280 : 0}ms`,
                    } as CSSProperties
                  }
                />
              ))}
            </g>
          )}
          <g
            className="exm-art-hub"
            data-active={mode === "collect"}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="m500 186 44 44-44 44-44-44Z" fill="var(--bg)" />
            <path d="M485 221 476 230l9 9M515 221l9 9-9 9M505 213l-10 34" />
          </g>
        </svg>
        <div
          className="exm-nodes"
          role="group"
          aria-label="选择智能体并发送信号"
          aria-describedby={hint}
        >
          {NODES.map((node, i) => (
            <button
              key={i}
              type="button"
              className="exm-node"
              style={{ left: `${node.x / 10}%`, top: `${node.y / 4.6}%` }}
              aria-label={`智能体 ${nodeNumber(i)}，发送信号`}
              aria-pressed={selected === i}
              data-active={active === i}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setHovered(i);
              }}
              onPointerLeave={() => setHovered(null)}
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible"))
                  setFocused(i);
              }}
              onBlur={() => setFocused(null)}
              onClick={() => send(i)}
            >
              <span className="exm-node-ring" aria-hidden="true">
                {nodeNumber(i)}
              </span>
              {pulse > 0 && (
                <span
                  key={pulse}
                  className="exm-node-echo"
                  aria-hidden="true"
                  style={{ animationDelay: `${arrivalDelay(i)}ms` }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="exm-art-footer">
        <div className="exm-signal-controls">
          <button
            type="button"
            className="exm-send"
            onClick={() => send(selected)}
          >
            发送信号 <span aria-hidden="true">↗</span>
          </button>
          <span className="exm-signal-status" aria-hidden="true">
            {code} / {nodeNumber(selected)}{" "}
            <b>#{String(pulse).padStart(2, "0")}</b>
          </span>
          <span className="sr-only" role="status">
            {pulse > 0
              ? `智能体 ${nodeNumber(selected)} 已发送${label}信号。共发送 ${pulse} 次。`
              : ""}
          </span>
        </div>
        <span id={hint} className="exm-hint">
          选择节点 · 观察协作
        </span>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="exm-art-repo"
          aria-label={`查看 ${name} GitHub 仓库`}
        >
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
