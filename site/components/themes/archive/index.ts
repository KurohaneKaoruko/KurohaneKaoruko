import { defineTheme } from "@/components/theme/types";
import "./theme.css";

export const archive = defineTheme({
  meta: {
    id: "archive",
    name: "Archive",
    label: "档案",
    desc: "黑底、信号红与大字号：直角、发丝线和图表式索引，把项目当作档案陈列。",
    swatch: ["#070809", "#ff453a"],
    status: "ARCHIVE ONLINE",
  },
  /**
   * 默认主题的首页由 app/page.tsx 直接服务端渲染（LCP 路径），
   * 这里的 loader 只用于主题页的按需预览 / 其他入口。
   */
  loadHome: () => import("./Home"),
});
