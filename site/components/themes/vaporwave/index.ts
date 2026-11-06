import { defineTheme } from "@/components/theme/types";
import "./theme.css";

export const vaporwave = defineTheme({
  meta: {
    id: "vaporwave",
    name: "Vaporwave",
    label: "蒸汽波",
    desc: "粉紫黄昏与无尽地平线：镭射渐变、网格海面与中轴展廊。",
    swatch: ["#2b0a3d", "#ff71ce"],
    status: "A E S T H E T I C",
  },
  loadHome: () => import("./Home"),
});
