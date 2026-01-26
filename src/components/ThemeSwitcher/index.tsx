/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 09:10:01
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-26 09:25:12
 * @Description: 主题切换
 */
'use client';
import { Button } from "@heroui/react";
import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from "next-themes";
import { type FC, useEffect, useState } from 'react';

import { THEME_MODE } from '@/enums';

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
  async function toggleDark() {

    if (!enableTransitions()) {
      toggleTheme();
      return;
    }

    await document.startViewTransition(async () => {
      toggleTheme();
    }).ready;

    document.documentElement.animate(
      { clipPath: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'] },
      {
        duration: 700,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  }
  return (
    <>
      <Button isIconOnly aria-label="ThemeSwitcher" variant="ghost" size="sm" onPress={toggleDark} className="rounded-full">
        <AnimatePresence mode="wait" initial={false}>
          {isLight ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="text-neutral-800 dark:text-neutral-200 flex justify-center items-center"
            >
              <Sun />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="text-neutral-800 dark:text-neutral-200 flex justify-center items-center"
            >
              <Moon />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
      <style>{`::view-transition-old(root), ::view-transition-new(root){animation:none;mix-blend-mode:normal;}`}</style>
    </>
  );
}
export default ThemeSwitcher;