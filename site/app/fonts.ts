import localFont from "next/font/local";

/**
 * 字体。
 *
 * 全部自托管、按需子集，走 next/font/local —— 它负责三件手工做容易出错的事：
 *
 * 1. **哈希文件名**：产物落到 /_next/static/media/<name>.<hash>.woff2。手写
 *    <link rel="preload"> 指向固定文件名会在构建后 404（资源被哈希改名了），
 *    等于白发一个请求。
 * 2. **自动 preload**：首屏用到的字体由框架注入 preload，时机在 CSS 之前。
 * 3. **fallback 度量对齐**：给系统字体算 size-adjust / ascent-override，
 *    字体换上来的时候行高不跳，CLS 不会因为 swap 冒出来。
 *
 * 中文为什么只留一个文件：原先 @fontsource-variable/noto-sans-sc 会注册
 * 101 个 unicode-range 分片，首屏正文一多就串行命中 14 个分片、约 670KB，
 * LCP 被拖到十几秒。现在整站字符集子集化成一个 271KB 文件，一次拿全。
 * 改文案后要重新跑：python scripts/subset-fonts.py
 */

/** 中文正文与标题。子集含站点全部汉字 + 常用符号，字重 300-900。 */
export const notoSansSC = localFont({
  src: "./fonts/noto-sans-sc-subset.woff2",
  weight: "300 900",
  style: "normal",
  display: "swap",
  preload: true,
  variable: "--font-noto-sc",
  // 只声明 CJK 与符号区间：拉丁字母交给 IBM Plex Sans，两套字形不打架
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+2E80-9FFF, U+F900-FAFF, U+FE30-FE4F, U+FF00-FFEF, U+20000-2FA1F, U+2190-21FF, U+2248, U+2260-2265, U+226A, U+2318, U+2500-25FF, U+2605, U+2713-2715",
    },
  ],
});

/** 拉丁字母与数字。可变字重 100-700。 */
export const plexSans = localFont({
  src: "./fonts/ibm-plex-sans-latin.woff2",
  weight: "100 700",
  style: "normal",
  display: "swap",
  preload: true,
  variable: "--font-plex-sans",
});

/** 等宽正文，400。 */
export const plexMono400 = localFont({
  src: "./fonts/ibm-plex-mono-latin-400.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  preload: true,
  variable: "--font-plex-mono-400",
});

/** 等宽强调，500。 */
export const plexMono500 = localFont({
  src: "./fonts/ibm-plex-mono-latin-500.woff2",
  weight: "500",
  style: "normal",
  display: "swap",
  preload: false,
  variable: "--font-plex-mono-500",
});
