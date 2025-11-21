/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 09:10:01
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 18:14:52
 * @Description: 主题切换
 */
'use client';
import { Button, cn } from "@heroui/react";
import { RiMoonLine, RiSunLine } from "@remixicon/react";
import { useTheme } from "next-themes";
import { type FC, type MouseEvent, useEffect, useState } from 'react';

import { THEME_MODE } from '@/lib/constant'

const ThemeSwitcher: FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 在客户端加载后，更新 mounted 状态，避免服务端渲染时的差异
  // 延迟更新 mounted 状态
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0); // 延迟到下一轮渲染
    return () => clearTimeout(timer);
  }, []);

  // 如果组件还没有挂载，返回一个空元素或者加载状态
  if (!mounted) {
    return null; // 或者可以返回一个 loading 动画
  }

  const isLight = theme === THEME_MODE.LIGHT;

  // 切换模式
  const toggleTheme = () => {
    setTheme(isLight ? THEME_MODE.DARK : THEME_MODE.LIGHT);
  };

  // 判断是否支持 startViewTransition API
  const enableTransitions = () =>
    "startViewTransition" in document && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  // 切换动画
  async function toggleDark({ clientX: x, clientY: y }: MouseEvent) {

    if (!enableTransitions()) {
      toggleTheme();
      return;
    }

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px at ${x}px ${y}px)`,
    ];

    await document.startViewTransition(async () => {
      toggleTheme();
    }).ready;

    document.documentElement.animate(
      { clipPath: isLight ? clipPath.reverse() : clipPath },
      {
        duration: 300,
        easing: "ease-in",
        pseudoElement: `::view-transition-${isLight ? "old" : "new"}(root)`,
      }
    );
  }
  return (
    <Button isIconOnly aria-label="ThemeSwitcher" variant="ghost" radius="full" size="sm">
      <div onClick={toggleDark} className="flex items-center justify-center w-full h-full">
        <div className="relative w-4.5 h-4.5">
          {/* 夜间图标 */}
          <RiMoonLine
            className={cn(
              "transition-all duration-500 transform absolute top-0 left-0 w-full h-full",
              !isLight ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            )}
          />

          {/* 日间图标 */}
          <RiSunLine
            className={cn(
              "transition-all duration-500 transform absolute top-0 left-0 w-full h-full",
              !isLight ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
            )}
          />
        </div>
      </div>
    </Button>
  );
}
export default ThemeSwitcher;