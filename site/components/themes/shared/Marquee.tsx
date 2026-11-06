/**
 * 主题首页用的跑马灯。
 *
 * 颜色全部走主题令牌，所以同一个组件在十二套主题里会呈现各自的强调色；
 * 动画与悬停暂停由 base.css 的 .marquee / .marquee-track 负责。
 */
export default function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee relative overflow-hidden border-y border-border bg-card-bg/30 py-3 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className="marquee-track flex w-max items-center gap-8">
        {row.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-8 font-mono text-xs uppercase tracking-[0.25em] text-text-muted"
          >
            <span className="text-primary">◆</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
