import { defineTheme } from "@/components/theme/types";
import "./theme.css";

export const defaultTheme = defineTheme({
  meta: {
    id: "default",
    name: "Default",
    label: "默认",
    desc: "黑白与少量红色。像素头像、巨型字标、项目概念图与可操作实验构成独立的个人作品集。",
    swatch: ["#080808", "#f04444"],
    status: "SYSTEM ONLINE",
  },
  loadHome: () => import("./Home"),
});
