import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-6 py-24 font-mono text-sm">
      <p className="text-text-dim">❯ cd /not-found</p>

      <p className="mt-8 text-7xl font-bold leading-none text-primary sm:text-9xl">404</p>

      <p className="mt-8 text-lg text-foreground">没有这个页面。</p>
      <p className="mt-3 leading-7 text-text-muted">
        请求的路径没有匹配到任何内容 —— 可能链接写错了，或者这个页面已经不在了。
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
        <Link href="/" className="text-primary underline-offset-4 hover:underline">
          返回首页
        </Link>
        <Link href="/projects/" className="text-primary underline-offset-4 hover:underline">
          projects/
        </Link>
        <span className="flex items-center gap-1.5 text-text-dim">
          <LogoMark className="h-3 w-3" />
          kurohane
        </span>
      </div>
    </div>
  );
}
