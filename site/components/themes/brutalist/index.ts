import { defineTheme } from "@/components/theme/types";
import "./theme.css";

export const brutalist = defineTheme({
  meta: {
    id: "brutalist",
    name: "Brutalist",
    label: "粗野",
    desc: "奶油纸面、硬黑边框与偏移阴影，像一张刚下印刷机的海报。",
    swatch: ["#f2efe9", "#ff2d2d"],
    status: "INK & PAPER",
  },
  loadHome: () => import("./Home"),
});
