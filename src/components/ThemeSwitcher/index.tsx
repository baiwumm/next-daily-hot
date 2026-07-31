/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-13 17:03:51
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:41:54
 * @Description: 主题切换
 */
'use client'
import { Moon, Sun } from '@gravity-ui/icons'
import { Button, Tooltip, useIsHydrated } from '@heroui/react'
import { AnimatePresence, motion } from 'motion/react'
import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

import { useBlurCircleTheme } from '@/hooks/use-blur-circle-theme'

import type { FC } from 'react'

const MotionMoon = motion.create(Moon)
const MotionSun = motion.create(Sun)

const ThemeSwitcher: FC = () => {
  const hydrated = useIsHydrated()
  const { theme, setTheme, resolvedTheme } = useTheme()

  // 使用 next-themes 控制主题
  const isDarkMode = theme === 'dark' || resolvedTheme === 'dark'

  const { ref, toggleTheme, isAnimating } = useBlurCircleTheme({
    isDarkMode,
    onDarkModeChange: (nextIsDark) => {
      setTheme(nextIsDark ? 'dark' : 'light')
    },
    duration: 750,
    blurAmount: 2,
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('/sounds/theme-toggle.mp3')
    audioRef.current.volume = 0.4
    audioRef.current.preload = 'auto'
    audioRef.current.load()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const playSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/theme-toggle.mp3')
    }
    audioRef.current.currentTime = 0
    audioRef.current.play().catch((error) => {
      console.warn('Failed to play audio:', error)
    })
  }

  const handleToggle = () => {
    if (isAnimating)
      return // 防止动画期间重复点击
    playSound()
    toggleTheme()
  }

  // 服务端渲染时返回占位
  if (!hydrated) {
    return null
  }

  return (
    <Tooltip delay={0}>
      <Button
        ref={ref}
        aria-label="ThemeSwitcher"
        size="sm"
        variant="ghost"
        isDisabled={isAnimating}
        isIconOnly
        onPress={handleToggle}
      >
        <AnimatePresence initial={false} mode="wait">
          {isDarkMode
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
