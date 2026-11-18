"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

const COLS = 36;
const ROWS = 25;
const FIELD_LAYOUT = { "--columns": COLS, "--rows": ROWS } as CSSProperties;
const SEEDS = [
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
const PRESETS = [
  { id: "field", label: "星群" },
  { id: "pulsar", label: "脉冲星" },
  { id: "glider", label: "滑翔机" },
] as const;
type Preset = (typeof PRESETS)[number]["id"];
type Cell = { x: number; y: number };
type Gesture = {
  id: number;
  value: number;
  last: Cell | null;
  tapOrigin?: Cell;
  moved: boolean;
};
const DIRECTIONS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

function initialCells(preset: Preset = "field") {
  const cells = new Uint8Array(COLS * ROWS);
  if (preset === "pulsar") {
    const pattern = [2, 3, 4, 8, 9, 10];
    for (const a of [0, 5, 7, 12]) {
      for (const b of pattern) {
        cells[(6 + a) * COLS + 11 + b] = 1;
        cells[(6 + b) * COLS + 11 + a] = 1;
      }
    }
    return cells;
  }
  const placements =
    preset === "glider"
      ? [
          [5, 5, 0],
          [14, 12, 0],
          [25, 5, 0],
          [25, 18, 0],
        ]
      : [
          [5, 6, 0],
          [19, 8, 2],
          [12, 17, 1],
          [28, 17, 0],
          [27, 3, 1],
        ];
  placements.forEach(([x, y, seed]) =>
    SEEDS[seed].forEach(([dx, dy]) => {
      cells[(y + dy) * COLS + x + dx] = 1;
    }),
  );
  return cells;
}

export function Experiment() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const cells = useRef(initialCells());
  const spare = useRef(new Uint8Array(COLS * ROWS));
  const generation = useRef(0);
  const counter = useRef<HTMLOutputElement>(null);
  const population = useRef<HTMLOutputElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const keyboardCell = useRef<Cell>({ x: 17, y: 12 });
  const gesture = useRef<Gesture | null>(null);
  const [running, setRunning] = useState(false);
  const [painted, setPainted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [preset, setPreset] = useState<Preset>("field");
  const [speed, setSpeed] = useState(1);
  const [announcement, setAnnouncement] = useState("");
  const instructions = useId();
  const drawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const draw = () => {
      const { width, height } = el;
      ctx.clearRect(0, 0, width, height);
      const cw = width / COLS,
        ch = height / ROWS;
      let aliveCount = 0;
      for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++) {
          const alive = cells.current[y * COLS + x];
          aliveCount += alive;
          ctx.fillStyle = alive
            ? (x * 3 + y) % 13 === 0
              ? "#f04444"
              : "#dbdbd6"
            : "#272727";
          const box = alive ? 0.74 : 0.11;
          ctx.fillRect(
            x * cw + (cw * (1 - box)) / 2,
            y * ch + (ch * (1 - box)) / 2,
            cw * box,
            ch * box,
          );
        }
      const currentGeneration = String(generation.current);
      if (el.dataset.generation !== currentGeneration) {
        el.dataset.generation = currentGeneration;
        if (counter.current)
          counter.current.value = currentGeneration.padStart(4, "0");
      }
      const currentPopulation = String(aliveCount);
      if (el.dataset.population !== currentPopulation) {
        el.dataset.population = currentPopulation;
        if (population.current)
          population.current.value = currentPopulation.padStart(3, "0");
      }
    };
    const resizeCanvas = ({
      width,
      height,
    }: {
      width: number;
      height: number;
    }) => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      el.width = Math.max(1, Math.round(width * dpr));
      el.height = Math.max(1, Math.round(height * dpr));
      draw();
    };
    drawRef.current = draw;
    const resize = new ResizeObserver(([entry]) =>
      resizeCanvas(entry.contentRect),
    );
    resize.observe(el);
    resizeCanvas(el.getBoundingClientRect());
    setPainted(true);
    return () => {
      resize.disconnect();
      drawRef.current = () => {};
    };
  }, []);

  const step = useCallback(() => {
    const before = cells.current;
    const after = spare.current;
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
    spare.current = before;
    generation.current++;
    drawRef.current();
  }, []);

  useEffect(() => {
    if (!running) return;
    const el = canvas.current;
    if (!el) return;
    let visible = false;
    let tick: number | undefined;
    const updateClock = () => {
      const canRun = visible && !document.hidden;
      if (!canRun) {
        window.clearInterval(tick);
        tick = undefined;
        return;
      }
      tick ??= window.setInterval(() => {
        if (!gesture.current) step();
      }, 145 / speed);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateClock();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", updateClock);
    return () => {
      window.clearInterval(tick);
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateClock);
    };
  }, [running, speed, step]);

  const showCursor = (cell: Cell | null) => {
    const el = cursor.current;
    if (!el) return;
    el.hidden = !cell;
    if (cell) {
      el.style.left = `${(cell.x / COLS) * 100}%`;
      el.style.top = `${(cell.y / ROWS) * 100}%`;
    }
  };

  const locate = (event: PointerEvent<HTMLCanvasElement>): Cell | null => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    if (!(x >= 0 && x < 1 && y >= 0 && y < 1)) return null;
    return {
      x: Math.floor(x * COLS),
      y: Math.floor(y * ROWS),
    };
  };

  const paint = (cell: Cell, value: number, previous: Cell | null = null) => {
    const from = previous ?? cell;
    const steps = Math.max(
      Math.abs(cell.x - from.x),
      Math.abs(cell.y - from.y),
      1,
    );
    for (let i = 0; i <= steps; i++) {
      const x = Math.round(from.x + ((cell.x - from.x) * i) / steps);
      const y = Math.round(from.y + ((cell.y - from.y) * i) / steps);
      cells.current[y * COLS + x] = value;
    }
    drawRef.current();
  };

  const pointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!painted || !event.isPrimary || event.button !== 0 || gesture.current)
      return;
    const cell = locate(event);
    if (!cell) return;
    const value = cells.current[cell.y * COLS + cell.x] ? 0 : 1;
    const tap = event.pointerType === "touch" && !editing;
    gesture.current = { id: event.pointerId, value, last: cell, moved: false };
    if (tap) {
      gesture.current.tapOrigin = { x: event.clientX, y: event.clientY };
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    showCursor(cell);
    paint(cell, value);
  };

  const pointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const current = gesture.current;
    if (!event.isPrimary || (current && current.id !== event.pointerId)) return;
    if (current?.tapOrigin) {
      const { x, y } = current.tapOrigin;
      current.moved ||= Math.hypot(event.clientX - x, event.clientY - y) >= 8;
      return;
    }
    if (!current && event.pointerType !== "mouse") return;
    const cell = locate(event);
    showCursor(cell);
    if (!current) return;
    if (!cell) {
      current.last = null;
      return;
    }
    if (current.last?.x === cell.x && current.last.y === cell.y) return;
    paint(cell, current.value, current.last);
    current.last = cell;
  };

  const pointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    if (current.tapOrigin && !current.moved && current.last) {
      const { x, y } = current.tapOrigin;
      if (Math.hypot(event.clientX - x, event.clientY - y) < 8) {
        paint(current.last, current.value);
      }
    }
    gesture.current = null;
    if (event.pointerType !== "mouse" || !locate(event)) showCursor(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const cancelGesture = (event: PointerEvent<HTMLCanvasElement>) => {
    if (gesture.current?.id !== event.pointerId) return;
    gesture.current = null;
    showCursor(null);
  };

  const keyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
    const cell = keyboardCell.current;
    const direction = DIRECTIONS[event.key];
    if (direction) {
      event.preventDefault();
      const [x, y] = direction;
      keyboardCell.current = {
        x: (cell.x + x + COLS) % COLS,
        y: (cell.y + y + ROWS) % ROWS,
      };
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (event.repeat) return;
      paint(cell, cells.current[cell.y * COLS + cell.x] ? 0 : 1);
    } else return;
    const { x, y } = keyboardCell.current;
    showCursor({ x, y });
    setAnnouncement(
      `第 ${y + 1} 行、第 ${x + 1} 列，${cells.current[y * COLS + x] ? "存活" : "空白"}。`,
    );
  };

  const reset = (next = preset) => {
    setRunning(false);
    setPreset(next);
    generation.current = 0;
    cells.current = initialCells(next);
    showCursor(null);
    drawRef.current();
  };

  return (
    <div className="folio-experiment" data-editing={editing}>
      <div className="experiment-title">
        <span>
          CONWAY’S
          <br />
          GAME OF LIFE
        </span>
        <span className="experiment-readouts">
          <span>
            GEN.{" "}
            <output ref={counter} aria-live="off">
              0000
            </output>
          </span>
          <span>
            LIVE{" "}
            <output ref={population} aria-live="off">
              029
            </output>
          </span>
        </span>
      </div>
      <div className="experiment-presets">
        <div
          className="experiment-patterns"
          role="group"
          aria-label="生命游戏图案"
        >
          {PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={!painted}
              aria-pressed={preset === item.id}
              onClick={() => reset(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="experiment-edit"
          disabled={!painted}
          aria-pressed={editing}
          onClick={() => setEditing(!editing)}
        >
          绘制 <span aria-hidden="true">{editing ? "●" : "+"}</span>
        </button>
      </div>
      <div className="experiment-field" style={FIELD_LAYOUT}>
        <canvas
          ref={canvas}
          tabIndex={painted ? 0 : -1}
          aria-label="生命游戏画布"
          aria-describedby={instructions}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerCancel={cancelGesture}
          onLostPointerCapture={cancelGesture}
          onPointerLeave={() => showCursor(null)}
          onKeyDown={keyDown}
          onFocus={(event) => {
            if (event.currentTarget.matches(":focus-visible"))
              showCursor(keyboardCell.current);
          }}
          onBlur={() => showCursor(null)}
        >
          康威生命游戏
        </canvas>
        <span
          ref={cursor}
          className="experiment-cursor"
          aria-hidden="true"
          hidden
        />
        {!painted && (
          <div className="experiment-static" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        )}
      </div>
      <div className="experiment-field-note">
        <span className="experiment-mouse-hint" aria-hidden="true">
          点击落子 · 拖动绘制
        </span>
        <span className="experiment-touch-hint" aria-hidden="true">
          {editing ? "滑动绘制 · 再按退出" : "轻点落子 · 开启绘制可拖动"}
        </span>
        <span id={instructions} className="sr-only">
          方向键移动，空格或回车切换细胞。
        </span>
        <div className="experiment-tools">
          <button
            type="button"
            disabled={!painted}
            onClick={() => {
              setRunning(false);
              cells.current.fill(0);
              generation.current = 0;
              drawRef.current();
            }}
          >
            清空
          </button>
          <button
            type="button"
            disabled={!painted}
            onClick={() => setSpeed(speed === 4 ? 1 : speed * 2)}
          >
            <span className="sr-only">切换速度，当前 </span>
            {speed}×
          </button>
        </div>
      </div>
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
      <div className="experiment-controls">
        <button
          type="button"
          disabled={!painted}
          onClick={() => setRunning(!running)}
          aria-pressed={running}
        >
          <span aria-hidden="true">{running ? "Ⅱ" : "▷"}</span>{" "}
          {running ? "暂停" : "运行"}
        </button>
        <button
          type="button"
          disabled={!painted}
          onClick={() => {
            setRunning(false);
            step();
          }}
        >
          单步 <span aria-hidden="true">→</span>
        </button>
        <button
          type="button"
          disabled={!painted}
          onClick={() => {
            SEEDS[0].forEach(([x, y]) => {
              cells.current[(7 + y) * COLS + 16 + x] = 1;
            });
            drawRef.current();
          }}
        >
          添加细胞 <span aria-hidden="true">+</span>
        </button>
        <button
          type="button"
          disabled={!painted}
          onClick={() => reset()}
          aria-label="重置生命游戏"
        >
          重置 <span aria-hidden="true">↺</span>
        </button>
      </div>
    </div>
  );
}
