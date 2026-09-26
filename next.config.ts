import type { NextConfig } from "next";

// GitHub Pages 项目页需带仓库名前缀；Vercel 等根路径部署不注入该变量即可
const isGithubPages = process.env.DEPLOY_TARGET === "pages";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubPages ? "/KurohaneKaoruko" : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  // 本地沙箱无法 spawn 类型检查子进程（stdio 管道受限）；
  // 类型校验由 CI workflow 中的独立 tsc 步骤执行
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
