import { defineTheme } from "@/components/theme/types";
import "./theme.css";

export const swiss = defineTheme({
  meta: {
    id: "swiss",
    name: "Swiss",
    label: "瑞士",
    desc: "国际主义排版：外露模数网格、竖排贴边与瑞士红，像一张构成主义海报。",
    swatch: ["#ffffff", "#e30613"],
    status: "GRID & RED",
  },
  loadHome: () => import("./Home"),
});
