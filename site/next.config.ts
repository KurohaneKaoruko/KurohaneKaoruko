import type { NextConfig } from "next";

// GitHub Pages 项目页需带仓库名前缀；Vercel 等根路径部署不注入该变量即可
const isGithubPages = process.env.DEPLOY_TARGET === "pages";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubPages ? "/KurohaneKaoruko" : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  // 关闭 AGENTS.md / CLAUDE.md 的自动生成（next dev 会重建这两个文件）
  agentRules: false,
  // 开发模式下允许 127.0.0.1 / 局域网 IP 访问：Next 默认只认 localhost，
  // 其它主机名访问时 dev 资源会被跨源阻断，页面没有 JS 可水合。
  allowedDevOrigins: ["127.0.0.1", "localhost", "*.local"],
  // 本地沙箱无法 spawn 类型检查子进程（stdio 管道受限）；
  // 类型校验由 CI workflow 中的独立 tsc 步骤执行
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
