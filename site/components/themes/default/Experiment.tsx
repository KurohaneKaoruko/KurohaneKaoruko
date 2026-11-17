"use client";

import { useEffect, useRef, useState } from "react";

const COLS = 36;
const ROWS = 25;
const seeds = [
  [
    [1, 0],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  [
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
    [1, 2],
  ],
  [
    [1, 0],
    [2, 0],
    [3, 0],
    [0, 1],
    [3, 1],
    [3, 2],
    [3, 3],
    [0, 4],
    [2, 4],
  ],
];

function initialCells() {
  const cells = new Uint8Array(COLS * ROWS);
  [
    [5, 6, 0],
    [19, 8, 2],
    [12, 17, 1],
    [28, 17, 0],
    [27, 3, 1],
  ].forEach(([x, y, seed]) =>
    seeds[seed].forEach(([dx, dy]) => {
      cells[(y + dy) * COLS + x + dx] = 1;
    }),
  );
  return cells;
}

export function Experiment() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const cells = useRef(initialCells());
  const generation = useRef(0);
  const counter = useRef<HTMLOutputElement>(null);
  const [running, setRunning] = useState(false);
  const [painted, setPainted] = useState(false);
  const drawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const draw = () => {
      const size = el.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio, 2);
      const w = Math.round(size.width * dpr),
        h = Math.round(size.height * dpr);
      if (el.width !== w || el.height !== h) {
        el.width = w;
        el.height = h;
      }
      ctx.clearRect(0, 0, w, h);
      const cw = w / COLS,
        ch = h / ROWS;
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const alive = cells.current[y * COLS + x];
          ctx.fillStyle = alive
            ? (x * 3 + y) % 13 === 0
              ? "#f04444"
              : "#dbdbd6"
            : "#202020";
          const box = alive ? 0.74 : 0.11;
          ctx.fillRect(
            x * cw + (cw * (1 - box)) / 2,
            y * ch + (ch * (1 - box)) / 2,
            cw * box,
            ch * box,
          );
        }
      }
      if (counter.current)
        counter.current.value = String(generation.current).padStart(4, "0");
      el.dataset.generation = String(generation.current);
    };
    drawRef.current = draw;
    const resize = new ResizeObserver(draw);
    resize.observe(el);
    draw();
    setPainted(true);
    return () => resize.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const tick = window.setInterval(() => {
      if (document.hidden) return;
      const rect = canvas.current?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > innerHeight) return;
      const before = cells.current;
      const after = new Uint8Array(before.length);
      for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++) {
          let neighbours = 0;
          for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++) {
              if (!dx && !dy) continue;
              neighbours +=
                before[
                  ((y + dy + ROWS) % ROWS) * COLS + ((x + dx + COLS) % COLS)
                ];
            }
          after[y * COLS + x] =
            neighbours === 3 || (before[y * COLS + x] && neighbours === 2)
              ? 1
              : 0;
        }
      cells.current = after;
      generation.current++;
      drawRef.current();
    }, 145);
    return () => window.clearInterval(tick);
  }, [running]);

  const add = () => {
    const seed = seeds[generation.current % seeds.length];
    seed.forEach(([x, y]) => {
      cells.current[(7 + y) * COLS + x + 16] = 1;
    });
    drawRef.current();
  };

  return (
    <div className="folio-experiment">
      <div className="experiment-title">
        <span>
          CONWAY’S
          <br />
          GAME OF LIFE
        </span>
        <span>
          GEN. <output ref={counter}>0000</output>
        </span>
      </div>
      <div className="experiment-field">
        <canvas
          ref={canvas}
          aria-label="康威生命游戏：每个白色方格代表存活细胞"
        />
        {!painted && (
          <div className="experiment-static" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        )}
      </div>
      <div className="experiment-controls">
        <button
          type="button"
          onClick={() => setRunning(!running)}
          aria-pressed={running}
        >
          <span aria-hidden="true">{running ? "Ⅱ" : "▷"}</span>{" "}
          {running ? "暂停" : "运行"}
        </button>
        <button type="button" onClick={add}>
          添加细胞 <span aria-hidden="true">+</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            cells.current = initialCells();
            generation.current = 0;
            drawRef.current();
          }}
          aria-label="重置生命游戏"
        >
          重置 ↺
        </button>
      </div>
    </div>
  );
}
