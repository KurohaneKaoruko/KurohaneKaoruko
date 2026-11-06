import { defineTheme } from "@/components/theme/types";
import "./theme.css";

export const cassette = defineTheme({
  meta: {
    id: "cassette",
    name: "Cassette Futurism",
    label: "卡带未来",
    desc: "被用过的未来：米色机身、琥珀屏幕与机架设备面板。",
    swatch: ["#e6e0d0", "#c2571a"],
    status: "TAPE DECK READY",
  },
  loadHome: () => import("./Home"),
});
