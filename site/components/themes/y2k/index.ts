import { defineTheme } from "@/components/theme/types";
import "./theme.css";

export const y2k = defineTheme({
  meta: {
    id: "y2k",
    name: "Y2K",
    label: "Y2K",
    desc: "千禧年银蓝梦：金属渐变、气泡高光与桌面图标墙。",
    swatch: ["#dfe9f8", "#2f6df6"],
    status: "HELLO WORLD 2000",
  },
  loadHome: () => import("./Home"),
});
