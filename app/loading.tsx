/**
 * 路由级加载态：只铺一层背景色，不出现任何"转圈"或骨架屏。
 *
 * 视觉入场全部交给启动屏与路由幕布，这里保持空白是刻意的 ——
 * 两个过渡系统同时演出只会互相打架。`route-loading` 标记供过渡层识别
 * "当前上屏的还只是 Suspense 空壳"。
 */
export default function Loading() {
  return <div className="route-loading min-h-screen bg-background" />;
}
