import { DEFAULT_THEME, THEMES, THEME_STORAGE_KEY } from "@/lib/themes";

/**
 * 在水合之前同步执行的内联脚本，做两件事：
 *   1. 把用户上次选择的主题写进 <html data-theme="...">，消除主题闪烁
 *   2. 首页挂上 bg-decor-on，让 body 的地形/点阵装饰层在首帧就在
 *
 * 必须保持"零依赖、同步执行"——任何 async / import 都会失效。
 */
export function ThemeScript() {
  const script = `(function(){try{
var ids=${JSON.stringify(THEMES.map((t) => t.id))};
var fallback=${JSON.stringify(DEFAULT_THEME)};
var stored=null;
try{stored=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}
var theme=ids.indexOf(stored)>-1?stored:fallback;
var root=document.documentElement;
root.setAttribute('data-theme',theme);
if(window.location.pathname==='/'){root.classList.add('bg-decor-on')}
}catch(e){document.documentElement.setAttribute('data-theme',${JSON.stringify(DEFAULT_THEME)})}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} suppressHydrationWarning />;
}
