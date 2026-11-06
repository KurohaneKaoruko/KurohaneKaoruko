import { defineTheme } from "@/components/theme/types";
import "./theme.css";

export const glacial = defineTheme({
  meta: {
    id: "glacial",
    name: "Glacial",
    label: "极境",
    desc: "冷白科幻界面：发丝细线、切角面板与冰蓝，像一台精密仪器。",
    swatch: ["#eef1f4", "#0891b2"],
    status: "GLACIAL // ONLINE",
  },
  loadHome: () => import("./Home"),
});
