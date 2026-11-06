import { defineTheme } from "@/components/theme/types";
import "./theme.css";

export const minimal = defineTheme({
  meta: {
    id: "minimal",
    name: "Minimal",
    label: "极简",
    desc: "单列编辑部排版：细体大字、发丝线网格与留白，装饰全部删去。",
    swatch: ["#ffffff", "#141414"],
    status: "LESS IS MORE",
  },
  loadHome: () => import("./Home"),
});
