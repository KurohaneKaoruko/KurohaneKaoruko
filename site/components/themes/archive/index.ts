import { defineTheme } from "@/components/theme/types";

export const archive = defineTheme({
  meta: {
    id: "archive",
    name: "Archive",
    label: "档案",
    desc: "黑底、单色信号与图表式索引：当前站点的原始设计，也是默认主题。",
    swatch: ["#070809", "#ff453a"],
    status: "ARCHIVE ONLINE",
  },
  /**
   * 默认主题的首页由 app/page.tsx 直接服务端渲染（LCP 路径），
   * 这里的 loader 只用于主题页的按需预览 / 其他入口。
   */
  loadHome: () => import("./Home"),
});
