import { ThemedHome } from "@/components/themes/ThemedHome";
import ArchiveHome from "@/components/themes/archive/Home";

/**
 * 首页。
 *
 * 默认主题「档案」仍由服务端直接渲染，首屏 HTML 完整、LCP 路径不变；
 * 其他主题在客户端选中后按需加载各自的首页组件树。
 */
export default function Home() {
  return <ThemedHome fallback={<ArchiveHome />} />;
}
