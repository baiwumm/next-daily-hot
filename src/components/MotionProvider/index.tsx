'use client'

import type { ReactNode } from 'react'

import { MotionConfig } from 'motion/react'

/**
 * 全局 motion 配置：
 * reducedMotion="user" —— 尊重系统「减少动态效果」设置，用户开启后自动禁用动画
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
