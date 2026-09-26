import { cn } from "@/lib/utils";

/**
 * 造型：一条终端竖线（光束） + 一个指向左边的实心三角，合起来读作 "K"。
 *
 * 三角与竖线**等高**（同为 26 单位，上下齐平、无出头），顶点夹角 **90°**
 * —— 进深 13 恰为半底 13，两条斜边各 45°。顶点落在两者的垂直平分线
 * y=16 上，两条斜边从竖线中点分别指向右上与右下，正好是 K 的两臂。
 * 三角与竖线之间留 3.2 单位空气，避免糊成一块。单一实色、无描边、无渐变。
 *
 * 整标 ink 宽 19.8（x 6.1 → 25.9），左右各余 6.1；高度方向上下各余 3。
 *
 * 【历史】四次迭代均被用户否决，改骨架前先读完这段：
 *   1. 三笔画结构（主干 + 上臂斜线 + 下臂楔形）——「改动太大，不如原来的竖线三角」
 *   2. 三角只占竖线约 73% 高、上下出头 ——「把三角形放大到与竖向等高，这样才像 K」
 *   3. 等高但不等边（顶点 93.6°）——「三角形改成等边，但高度不变」
 *   4. 等边三角（顶点 60°，进深 22.52，整标近乎占满宽度）——「三角形放大之后好丑」
 * 现行即为等高 + 顶角 90°。
 *
 * 两个导出：
 *   LogoMark —— 只有图形本身，颜色走 currentColor（深浅底都随主题）
 *   Logo     —— 只做尺寸与配色包装；黑底方块已按用户要求移除
 */

const MARK_STEM = { x: 6.1, y: 3, width: 3.6, height: 26 };
const MARK_WEDGE = "12.9,16 25.9,3 25.9,29";

export function LogoMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("block", className)}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {/* 终端竖线 */}
      <rect
        x={MARK_STEM.x}
        y={MARK_STEM.y}
        width={MARK_STEM.width}
        height={MARK_STEM.height}
        fill="currentColor"
      />
      {/* 指向左边的三角 */}
      <polygon points={MARK_WEDGE} fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  title = "Kurohane Kaoruko",
}: {
  className?: string;
  markClassName?: string;
  title?: string;
}) {
  return (
    <span className={cn("flex shrink-0 items-center justify-center text-foreground", className)}>
      <LogoMark className={cn("h-full w-full", markClassName)} title={title} />
    </span>
  );
}
