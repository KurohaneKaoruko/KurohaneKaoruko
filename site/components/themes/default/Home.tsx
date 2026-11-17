import { Hero } from "./Hero";
import { SelectedWork } from "./SelectedWork";
import { RepositoryIndex } from "./RepositoryIndex";

/**
 * 默认主题的首页。
 *
 * 保持服务端组件：首屏 HTML 直接带全部内容，不依赖水合，也不进
 * 主题的懒加载包。其他主题由 ThemedHome 在客户端按需替换这棵树。
 */
export default function DefaultHome() {
  return (
    <div className="personal-site">
      <Hero />
      <SelectedWork />
      <RepositoryIndex />
    </div>
  );
}
