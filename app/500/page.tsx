import type { Metadata } from "next";
import ServerError from "@/components/ui/ServerError";

/**
 * /500 —— 500 视图的常驻入口（v70 起从 dev-only 预览转正）。
 *
 * 404 天生可访问（任意错误路径都落到 not-found），500 却只能等真实报错才出现；
 * 这个路由把 500 视图变成站点的一部分，任何人都可以直接访问查看。
 *
 * 与 app/error.tsx 的关系：真实错误仍由 error.tsx 的错误边界承接（传入真实
 * message/digest 与 reset）；这里展示的是模拟数据，页面本身不会触发报错，
 * 「重试」按钮退化为刷新当前路由。
 *
 * noindex：这是演示页，不该被搜索引擎收录。
 */
export const metadata: Metadata = {
  title: "500 · internal server error",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ServerError
      message={
        "DemoModeError: 这是一次模拟的服务器错误展示。\n\n" +
        "真实错误由 app/error.tsx 的错误边界承接；本页为常驻演示路由，\n" +
        "用于随时查看 500 视图的设计与动效。\n\n" +
        "at renderComponent (demo/500-preview:1:1)"
      }
      digest="demo-500-preview"
    />
  );
}
