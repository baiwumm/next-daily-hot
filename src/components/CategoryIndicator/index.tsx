/*
 * @Description: 页面右侧分类锚点指示器（hover 浮出分类名，点击平滑滚动，scroll-spy 高亮）
 * 骨架取自 better-nav 同名组件，按本项目分类模型适配（分类名即锚点 id）
 */
'use client'
import type { HotCategory } from '@/enums'

import { cn, Tooltip } from '@heroui/react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { smoothScrollTo } from '@/lib/utils'

interface CategoryIndicatorProps {
  /** 用户排序后的可见分类（与首页分节同源） */
  categories: HotCategory[]
}

/** hover 离开后恢复横线状态的延迟（与 Tooltip closeDelay 保持一致） */
const CLOSE_DELAY = 150

export default function CategoryIndicator({ categories }: CategoryIndicatorProps) {
  const [activeCategory, setActiveCategory] = useState<HotCategory | ''>('')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const tickingRef = useRef(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // scroll-spy：以视口 30% 高度线为基准，高亮距离该线最近的分类
  useEffect(() => {
    const getActiveCategory = () => {
      const threshold = window.innerHeight * 0.3
      let current: HotCategory | '' = ''
      let minDist = Number.POSITIVE_INFINITY

      categories.forEach((category) => {
        const el = document.getElementById(`cat-${category}`)

        if (!el) return
        const dist = Math.abs(el.getBoundingClientRect().top - threshold)

        if (dist < minDist) {
          minDist = dist
          current = category
        }
      })

      return current
    }

    const update = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        const current = getActiveCategory()

        setActiveCategory((prev) => (prev === current ? prev : current))
        tickingRef.current = false
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [categories])

  // 卸载时清理关闭定时器
  useEffect(() => () => clearTimeout(closeTimerRef.current), [])

  // active 分类更新时，将对应横线滚动到指示器可视区内（分类过多时保证高亮可见）
  useEffect(() => {
    if (!activeCategory) return
    const barEl = document.getElementById(`cat-bar-${activeCategory}`)

    barEl?.scrollIntoView({ block: 'nearest' })
  }, [activeCategory])

  // 带 hash 访问时定位到对应分类（分类名为中文，hash 会被编码，需解码后再匹配）
  useEffect(() => {
    const hash = window.location.hash

    if (!hash.startsWith('#cat-')) return
    const el = document.getElementById(`cat-${decodeURIComponent(hash.slice('#cat-'.length))}`)

    if (!el) return
    // 等一帧，确保分类区块布局稳定后再定位；scroll-mt-24 = 6rem = 96px
    requestAnimationFrame(() => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96 }))
  }, [])

  const handleMouseEnter = useCallback((index: number) => {
    clearTimeout(closeTimerRef.current)
    setHoveredIndex(index)
  }, [])

  const handleMouseLeave = useCallback(() => {
    clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(setHoveredIndex, CLOSE_DELAY, null)
  }, [])

  const scrollToCategory = useCallback((category: HotCategory) => {
    const el = document.getElementById(`cat-${category}`)

    if (!el) return
    // scroll-mt-24 = 6rem = 96px，给 sticky Header 让位
    smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - 96)
    // 同步 URL hash（replaceState 不产生历史噪音）：刷新/分享可定位
    history.replaceState(null, '', `#cat-${category}`)
  }, [])

  // 分类过少时指示器无意义，直接隐藏
  if (categories.length < 3) return null

  return (
    <nav
      aria-label="分类导航"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 max-h-[calc(100vh-8rem)] flex-col items-center overflow-y-auto lg:flex"
    >
      {categories.map((category, index) => {
        // 以 hover 项为中心向上下扩散的阶梯距离（音谱效果），无 hover 时为无穷远
        const distance = hoveredIndex === null ? Number.POSITIVE_INFINITY : Math.abs(hoveredIndex - index)
        const isActive = category === activeCategory

        // 阶梯样式（品牌色）：hover 最亮最宽，逐层向上下衰减；active 项若在阶梯外（或无 hover）才显示独立 active 样式
        let barClass: string

        if (hoveredIndex !== null) {
          if (distance === 0) barClass = 'w-7 bg-accent'
          else if (distance === 1) barClass = 'w-6 bg-accent/70'
          else if (distance === 2) barClass = 'w-5 bg-accent/45'
          else barClass = isActive ? 'w-5 bg-accent' : 'w-4 bg-accent/15'
        } else {
          barClass = isActive ? 'w-5 bg-accent' : 'w-4 bg-accent/15'
        }

        return (
          <Tooltip key={category} closeDelay={CLOSE_DELAY} delay={0}>
            <Tooltip.Trigger>
              {/* 整个槽位是 hover 热区，也是点击跳转区 */}
              <button
                aria-label={`跳转到分类：${category}`}
                className="flex h-4 w-7 cursor-pointer items-center justify-end"
                id={`cat-bar-${category}`}
                type="button"
                onClick={() => scrollToCategory(category)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <span className={cn('h-1 rounded-full transition-all duration-300', barClass)} />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content showArrow offset={8} placement="left">
              <Tooltip.Arrow />
              {category}
            </Tooltip.Content>
          </Tooltip>
        )
      })}
    </nav>
  )
}
