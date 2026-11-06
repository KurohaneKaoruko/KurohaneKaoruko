import { defineTheme } from "@/components/theme/types";
import "./theme.css";

export const glitch = defineTheme({
  meta: {
    id: "glitch",
    name: "Glitch",
    label: "故障",
    desc: "满幅截获频段：红蓝错位、扫描线与撕裂边缘，像被恢复的信号。",
    swatch: ["#060607", "#ff2a2a"],
    status: "SIGNAL RECOVERED",
  },
  loadHome: () => import("./Home"),
});
