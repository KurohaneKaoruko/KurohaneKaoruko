import { defineTheme } from "@/components/theme/types";
import "./theme.css";

export const terminal = defineTheme({
  meta: {
    id: "terminal",
    name: "Terminal",
    label: "终端",
    desc: "磷光红黑控制台：等宽字、网格与终端会话回放，像一台没关机的旧机器。",
    swatch: ["#080808", "#ff3333"],
    status: "PHOSPHOR ONLINE",
  },
  loadHome: () => import("./Home"),
});
