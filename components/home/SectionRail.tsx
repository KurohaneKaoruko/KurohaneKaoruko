/**
 * 区块侧轴（Section Rail）。
 *
 * 首页原先每个区块都只有 `container mx-auto px-4` 一条左右边界，整页只有一根竖轴、
 * 横向没有张力。这个组件把 12 栏骨架里最左的 3 栏常驻下来：左轴放区块编号与元信息，
 * 右侧 9 栏才是内容，于是 `#projects` 与 `#terminal` 各自成为一条双轴版面。
 *
 * 约束（改动前先读）：
 * - **移动端（<lg）整块隐藏**：它以 DOM 先行顺序出现在内容之前，若不隐藏，
 *   手机上的阅读顺序会变成「元信息 → 正文」，正文被顶到下方。
 * - **纯静态**：无 state、无 effect、无事件处理，服务端即可渲染完。
 * - **sticky 偏移只引用 `var(--nav-h)`**：终端主题 64px、brutalist 主题 76px
 *   （见 globals.css:42 / :82），写死 64px 会在另一套主题里被导航盖住。
 * - **aria-hidden**：这里承载的编号 / 英文名 / 中文副标在紧随其后的 SectionHeader
 *   里已完整出现一遍，整块标为装饰，避免屏幕阅读器把同一组信息读两遍。
 *   DOM 顺序（侧轴在前、内容在后）与 lg 断点下的视觉顺序一致。
 */
export type SectionRailProps = {
  /** 区块编号，与 SectionHeader 的 id 保持一致：01 / 02 */
  index: string;
  /** 区块英文名 */
  label: string;
  /** 中文副标，竖排 */
  cnLabel: string;
  /** 该区块可公开的计数或提示。静态文案，不接实时数据，避免与服务端导出漂移 */
  meta: string;
  /** 可选补充提示 */
  hint?: string;
};

export default function SectionRail({ index, label, cnLabel, meta, hint }: SectionRailProps) {
  return (
    <aside aria-hidden="true" className="hidden lg:col-span-3 lg:block">
      {/* 网格项默认 align-self: stretch，所以这个外层会撑满整个区段高度，
          内层 sticky 才有可滚动的行程 —— 不要给外层加 self-start。 */}
      <div className="flex flex-col gap-3 border-l border-border pl-5 lg:sticky lg:top-[calc(var(--nav-h)+32px)]">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
          {index}
        </span>

        <span className="display-title text-3xl leading-none text-foreground">{label}</span>

        <span className="writing-vertical-rl self-start text-sm font-bold tracking-[0.25em] text-text-muted">
          {cnLabel}
        </span>

        <span className="mt-3 h-px w-10 bg-primary/40" />

        <span className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-text-dim">
          {meta}
        </span>

        {hint ? (
          <span className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-text-muted/60">
            {hint}
          </span>
        ) : null}
      </div>
    </aside>
  );
}
