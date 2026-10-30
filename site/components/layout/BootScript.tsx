/**
 * 水合前标记 JS 可用：CSS 据此决定是否隐藏待显现的内容。
 * 没有这一步，禁用脚本的读者会看到一片空白。
 */
export function BootScript() {
  const code = `document.documentElement.classList.add("js");`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
