"use client";

import { useEffect, useState } from "react";

/** Asia/Shanghai 的 HH:MM。每 20s 对一次表。 */
function useLocalTime() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("zh-CN", {
          timeZone: "Asia/Shanghai",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    };
    tick();
    const timer = window.setInterval(tick, 20000);
    return () => window.clearInterval(timer);
  }, []);

  return time;
}

/**
 * 本地时间，裸时刻。
 *
 * 服务端先渲染占位符，挂载后再填上 —— 避免静态 HTML 里凝固着一个过期的时间。
 * 首页档案卡里的 BASE 行用它。
 */
export function BaseTime() {
  const time = useLocalTime();
  return <span className="num">{time}</span>;
}

/** 页脚的本地时间：状态点 + LOCAL + 时刻 + 时区。 */
export function Clock() {
  const time = useLocalTime();

  return (
    <span className="inline-flex items-center gap-2">
      <span className="status-dot" aria-hidden="true" />
      LOCAL <BaseTime /> UTC+8
    </span>
  );
}
