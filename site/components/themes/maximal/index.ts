import { defineTheme } from "@/components/theme/types";
import "./theme.css";

export const maximal = defineTheme({
  meta: {
    id: "maximal",
    name: "Maximal",
    label: "极繁",
    desc: "极繁主义：色块碰撞、纹样密度与拼贴徽章，拒绝留白。",
    swatch: ["#faf3e3", "#d4380d"],
    status: "MORE IS MORE",
  },
  loadHome: () => import("./Home"),
});
