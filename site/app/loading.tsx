/**
 * 路由级加载态：一行状态字，不做骨架屏。
 * 静态导出的页面几乎是瞬间到达，骨架只会闪一下。
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="label flex items-center gap-3">
        <span className="status-dot" aria-hidden="true" />
        LOADING
      </p>
    </div>
  );
}
