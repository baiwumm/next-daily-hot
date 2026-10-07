/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-19 15:55:09
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-14 15:17:15
 * @Description: 首页
 */
'use client'

import { Button, Card, Description, ScrollShadow, Separator, Skeleton } from '@heroui/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'

import HotCard from '@/components/HotCard'
import SkeletonCard from '@/components/SkeletonCard'
import { CATEGORY_GROUPS, HOT_ITEMS } from '@/enums'
import { useAppStore } from '@/store/useAppStore'

const gridClassName = 'grid gap-4 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const hiddenItems = useAppStore((state) => state.hiddenItems)
  const sortItems = useAppStore((state) => state.sortItems)
  const activeCategory = useAppStore((state) => state.activeCategory)
  const setActiveCategory = useAppStore((state) => state.setActiveCategory)

  // 分类 → 平台值集合（'all' 时为 null 表示不过滤）
  const categorySet = useMemo(() => {
    if (activeCategory === 'all') return null

    const group = CATEGORY_GROUPS.find((group) => group.category === activeCategory)

    return group ? new Set(group.values) : null
  }, [activeCategory])

  // 过滤链：拖拽排序 → 排除设置里隐藏的 → 按分类过滤（三者正交叠加）
  const visibleItems = useMemo(() => {
    const hiddenSet = new Set(hiddenItems ?? [])

    return sortItems.filter((value) => !hiddenSet.has(value) && (!categorySet || categorySet.has(value)))
  }, [hiddenItems, sortItems, categorySet])

  useEffect(() => {
    const timer = setTimeout(setMounted, 0, true)

    return () => clearTimeout(timer)
  }, [])

  // 挂载前渲染骨架网格，避免 SSR 空白 + 全屏 loading 的闪烁
  if (!mounted) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: 8 }, (_, index) => (
          <Card key={index + 1} className="p-0 gap-0">
            <Card.Header className="flex justify-between items-center flex-row p-3">
              <div className="flex items-center gap-2">
                <Skeleton className="size-6 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </Card.Header>
            <Separator />
            <Card.Content className="relative py-0 h-81.75 overflow-hidden">
              <SkeletonCard />
            </Card.Content>
            <Separator />
            <Card.Footer className="p-3">
              <Skeleton className="h-4 w-32 rounded-md" />
            </Card.Footer>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      {/* 分类过滤：单选 Chip 行（ScrollShadow 横向滚动），切换时下方网格走 FLIP 重排动画 */}
      <div aria-label="卡片分类过滤" role="group">
        <ScrollShadow hideScrollBar className="flex gap-2 mb-4" orientation="horizontal">
          {[{ category: 'all' as const, label: '全部' }, ...CATEGORY_GROUPS].map(({ category }) => (
            <Button
              key={category}
              aria-pressed={activeCategory === category}
              className="shrink-0"
              size="sm"
              variant={activeCategory === category ? 'primary' : 'ghost'}
              onPress={() => setActiveCategory(category)}
            >
              {category === 'all' ? '全部' : category}
            </Button>
          ))}
        </ScrollShadow>
      </div>
      {visibleItems.length ? (
        // 👇 父容器只用 motion.div 承载 variants；不要开启 layout——
        // 网格重排时父级 layout 的变换补偿会叠加在子级 FLIP 动画上，造成卡片错位/整片空白
        <motion.div
          animate="visible"
          className={gridClassName}
          initial="hidden"
          variants={{ visible: { transition: { staggerChildren: 0.02 } } }} // ✅ 卡片依次交错浮现
        >
          {/* popLayout：退场卡片立即脱离文档流（仍播放退场动画），连续快速切换分类不会互相占位导致整片空白 */}
          <AnimatePresence mode="popLayout">
            {visibleItems.map((value) => {
              const raw = HOT_ITEMS.raw(value)

              if (!raw) return null

              return (
                // 👇 每个子项也必须是 motion.div + layout
                <motion.div
                  key={raw.value}
                  layout // ✅ 关键：让位置变化可动画
                  exit={{
                    opacity: 0,
                    filter: 'blur(4px)',
                    y: 20,
                    transition: { duration: 0.3, ease: 'easeOut' },
                  }}
                  transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 } }} // ✅ 位置变化用 spring，更跟手
                  variants={{
                    hidden: { opacity: 0, filter: 'blur(4px)', y: 20 },
                    visible: {
                      opacity: 1,
                      filter: 'blur(0px)',
                      y: 0,
                      transition: { duration: 0.4, ease: 'easeOut' },
                    },
                  }}
                >
                  <HotCard {...raw} />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <Description className="flex h-40 justify-center items-center text-center">
          该分类下没有显示中的卡片，可在右上角设置中开启对应热榜 🤔
        </Description>
      )}
    </>
  )
}
