import { defineTheme } from "@/components/theme/types";
import "./theme.css";

export const cyberpunk = defineTheme({
  meta: {
    id: "cyberpunk",
    name: "Cyberpunk",
    label: "赛博",
    desc: "夜城霓虹与酸雨：霓虹描边、全息雨幕与错位悬赏钉板。",
    swatch: ["#0b0b16", "#00f0ff"],
    status: "NEON RAIN",
  },
  loadHome: () => import("./Home"),
});
