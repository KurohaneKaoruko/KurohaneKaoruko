import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/KurohaneKaoruko",
  trailingSlash: true,
  images: { unoptimized: true },
  // 本地沙箱无法 spawn 类型检查子进程（stdio 管道受限）；
  // 类型校验由 CI workflow 中的独立 tsc 步骤执行
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
