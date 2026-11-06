import { DEFAULT_THEME, THEMES, THEME_STORAGE_KEY } from "@/components/theme/registry";

/**
 * 在水合之前同步执行的内联脚本。
 *
 * 只做一件事：把用户上次选择的主题写进 <html data-theme="...">。
 * 不这样做的话，首帧会先按默认主题画一遍，水合后才跳到真实主题 ——
 * 深色与亮色主题之间那一闪非常刺眼。
 *
 * 必须保持「零依赖、同步执行」——任何 async / import 都会错过首帧。
 */
export function ThemeScript() {
  const script = `(function(){try{
var ids=${JSON.stringify(THEMES.map((theme) => theme.meta.id))};
var fallback=${JSON.stringify(DEFAULT_THEME)};
var stored=null;
try{stored=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}
var theme=ids.indexOf(stored)>-1?stored:fallback;
document.documentElement.setAttribute('data-theme',theme);
}catch(e){document.documentElement.setAttribute('data-theme',${JSON.stringify(DEFAULT_THEME)})}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} suppressHydrationWarning />;
}
