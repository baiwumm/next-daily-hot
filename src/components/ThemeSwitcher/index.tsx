/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-13 17:03:51
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-17 17:23:10
 * @Description: 主题切换
 */
"use client";
import { Moon, Sun } from '@gravity-ui/icons';
import { Button, Tooltip } from '@heroui/react';
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from 'next-themes';
import { type FC } from "react";

import { THEME_MODE } from '@/enums';

const MotionMoon = motion.create(Moon);
const MotionSun = motion.create(Sun);

const ThemeSwitcher: FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === THEME_MODE.DARK;
  return (
    <Tooltip delay={0}>
      <Button
        aria-label="ThemeSwitcher"
        variant="ghost"
        size='sm'
        isIconOnly
        onPress={() => setTheme(theme === THEME_MODE.DARK ? THEME_MODE.LIGHT : THEME_MODE.DARK)}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <MotionMoon
              key="moon"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />
          ) : (
            <MotionSun
              key="sun"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>
      </Button>
      <Tooltip.Content showArrow>
        <Tooltip.Arrow />
        主题切换
      </Tooltip.Content>
    </Tooltip>
  );
};

export default ThemeSwitcher;
