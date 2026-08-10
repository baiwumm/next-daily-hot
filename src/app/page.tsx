/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-19 15:55:09
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-14 15:17:15
 * @Description: 首页
 */
'use client'

import { Card, Separator, Skeleton } from '@heroui/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'

import HotCard from '@/components/HotCard'
import SkeletonCard from '@/components/SkeletonCard'
import { HOT_ITEMS } from '@/enums'
import { useAppStore } from '@/store/useAppStore'

const gridClassName = 'grid gap-4 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const hiddenItems = useAppStore(state => state.hiddenItems)
  const sortItems = useAppStore(state => state.sortItems)

  const visibleItems = useMemo(() => {
    const hiddenSet = new Set(hiddenItems ?? [])
    return sortItems.filter(value => !hiddenSet.has(value))
  }, [hiddenItems, sortItems])

  useEffect(() => {
    const timer = setTimeout(setMounted, 0, true)
    return () => clearTimeout(timer)
  }, [])

  // 挂载前渲染骨架网格，避免 SSR 空白 + 全屏 loading 的闪烁
  if (!mounted) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="p-0 gap-0">
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
    // 👇 父容器必须是 motion.div 并开启 layout
    <motion.div
      initial="hidden"
      layout // ✅ 启用布局动画
      variants={{ visible: { transition: { staggerChildren: 0.02 } } }} // ✅ 卡片依次交错浮现（30 张卡约 0.6s，避免过长）
      viewport={{ once: true, margin: '-50px' }}
      whileInView="visible"
      className={gridClassName}
    >
      <AnimatePresence>
        {visibleItems.map((value) => {
          const raw = HOT_ITEMS.raw(value)
          return (
            // 👇 每个子项也必须是 motion.div + layout
            <motion.div
              key={raw.value}
              exit={{
                opacity: 0,
                filter: 'blur(4px)',
                y: 20,
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              layout // ✅ 关键：让位置变化可动画
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
  )
}
