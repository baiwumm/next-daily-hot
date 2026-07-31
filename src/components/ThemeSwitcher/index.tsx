/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-13 17:03:51
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-17 17:23:10
 * @Description: 主题切换
 */
'use client'
import { Moon, Sun } from '@gravity-ui/icons'
import { Button, Tooltip } from '@heroui/react'
import { AnimatePresence, motion } from 'motion/react'
import { useTheme } from 'next-themes'

import { THEME_MODE } from '@/enums'

import type { FC } from 'react'

const MotionMoon = motion.create(Moon)
const MotionSun = motion.create(Sun)

const ThemeSwitcher: FC = () => {
  const { theme, setTheme } = useTheme()
  const isDark = theme === THEME_MODE.DARK
  return (
    <Tooltip delay={0}>
      <Button
        aria-label="ThemeSwitcher"
        size="sm"
        variant="ghost"
        isIconOnly
        onPress={() => setTheme(theme === THEME_MODE.DARK ? THEME_MODE.LIGHT : THEME_MODE.DARK)}
      >
        <AnimatePresence initial={false} mode="wait">
          {isDark
            ? (
                <MotionMoon
                  key="moon"
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                />
              )
            : (
                <MotionSun
                  key="sun"
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                />
              )}
        </AnimatePresence>
      </Button>
      <Tooltip.Content showArrow>
        <Tooltip.Arrow />
        主题切换
      </Tooltip.Content>
    </Tooltip>
  )
}

export default ThemeSwitcher
