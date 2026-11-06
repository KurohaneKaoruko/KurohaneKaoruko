import { defineTheme } from "@/components/theme/types";
import "./theme.css";

export const deconstruct = defineTheme({
  meta: {
    id: "deconstruct",
    name: "Deconstruct",
    label: "解构",
    desc: "断裂的版面：错版双框、被裁开的碎片与被拆散的大标题，结构裸露在外。",
    swatch: ["#f2efe8", "#d33b1f"],
    status: "FORM FOLLOWS FRACTURE",
  },
  loadHome: () => import("./Home"),
});
