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
  /** 保留原版档案首页，切换时独立加载。 */
  loadHome: () => import("./Home"),
});
