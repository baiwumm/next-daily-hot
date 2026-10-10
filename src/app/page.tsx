/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-19 15:55:09
 * @LastEditTime: 2026-10-07 23:30:00
 * @Description: 首页（按分类分节纵向渲染，右侧锚点指示器导航）
 */
'use client'

import { Card, Separator, Skeleton } from '@heroui/react'
import { StarFill } from '@gravity-ui/icons'
import { motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'

import BlurFade from '@/components/BlurFade'
import CategoryIndicator from '@/components/CategoryIndicator'
import HotCard from '@/components/HotCard'
import SkeletonCard from '@/components/SkeletonCard'
import { getCategoryValues, getOrderedCategories, CATEGORY_GROUPS, FAVORITE_CATEGORY, HOT_ITEMS } from '@/enums'
import { useAppStore } from '@/store/useAppStore'

const gridClassName = 'grid gap-4 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]'

// 挂载前的整页骨架：按配置分类分节、每节渲染实际卡片数，与真实布局同构，挂载切换时不跳动。
// 只从配置推导（SSR 与客户端首帧完全一致），不读 store 持久化状态，规避 hydration 不匹配
function SkeletonSections() {
  return (
    <div className="space-y-10">
      {CATEGORY_GROUPS.map(({ category, values }) => (
        <div key={category} className="flex flex-col gap-3">
          <Skeleton className="h-5 w-24 rounded-md" />
          <div className={gridClassName}>
            {values.map((value) => (
              <SkeletonHotCard key={value} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function SkeletonHotCard() {
  return (
    <Card className="p-0 gap-0">
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
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const hiddenItems = useAppStore((state) => state.hiddenItems)
  const sortItems = useAppStore((state) => state.sortItems)
  const categoryOrder = useAppStore((state) => state.categoryOrder)
  const favoriteItems = useAppStore((state) => state.favoriteItems)

  // 分节数据：常看收藏（置顶，收藏后即从原分类移入）+ 分类顺序（用户排序）× 块内平台顺序（用户排序）
  // × 排除设置里隐藏的平台；读取时归一化——配置新增的分类/平台自动补尾，下线的自动剔除，无卡片的分节不渲染
  const sections = useMemo(() => {
    const hiddenSet = new Set(hiddenItems ?? [])
    const favSet = new Set(favoriteItems)
    const favorites = favoriteItems.filter((value) => !hiddenSet.has(value) && HOT_ITEMS.raw(value))
    const categorySections = getOrderedCategories(categoryOrder)
      .map((category) => ({
        category,
        values: getCategoryValues(sortItems, category).filter((value) => !hiddenSet.has(value) && !favSet.has(value)),
      }))
      .filter(({ values }) => values.length > 0)

    return favorites.length
      ? [{ category: FAVORITE_CATEGORY, values: favorites }, ...categorySections]
      : categorySections
  }, [categoryOrder, sortItems, hiddenItems, favoriteItems])

  useEffect(() => {
    const timer = setTimeout(setMounted, 0, true)

    return () => clearTimeout(timer)
  }, [])

  // 挂载前渲染与真实布局同构的骨架，避免 SSR 空白 + 全屏 loading 的闪烁
  if (!mounted) {
    return <SkeletonSections />
  }

  return (
    <>
      <div className="space-y-10">
        {sections.map(({ category, values }) => (
          // layout：设置里 ↑/↓ 调整分类顺序时，分节交换带 FLIP 平滑动画（与设置弹窗一致）
          // scroll-mt：锚点定位时给 sticky Header 让位；id 供 CategoryIndicator scroll-spy 与跳转
          <BlurFade
            key={category}
            layout
            className="flex flex-col gap-3 scroll-mt-24"
            id={`cat-${category}`}
            transition={{ duration: 0.3, ease: 'easeOut', layout: { type: 'spring', stiffness: 300, damping: 34 } }}
          >
            <h2 className="flex items-center gap-1.5 text-lg font-black">
              {category === FAVORITE_CATEGORY && <StarFill className="text-warning" width={18} />}
              {category}
            </h2>
            <div className={gridClassName}>
              {values.map((value, index) => {
                const raw = HOT_ITEMS.raw(value)

                if (!raw) return null

                return (
                  // layout="position"：设置里平台排序/显隐后，卡片 FLIP 滑动到新位置（只动画位置，避免 scale 拉伸卡内内容）
                  <motion.div
                    key={value}
                    layout="position"
                    transition={{ layout: { type: 'spring', stiffness: 350, damping: 35 } }}
                  >
                    {/* 每张卡独立 BlurFade（自身 useInView once 触发淡入，与兄弟状态解耦）：
                        不用父级 stagger variants——显隐/重排后新插入的卡可能卡在 hidden 态，产生空白占位 */}
                    <BlurFade className="h-full" delay={Math.min(index * 0.04, 0.24)}>
                      <HotCard {...raw} />
                    </BlurFade>
                  </motion.div>
                )
              })}
            </div>
          </BlurFade>
        ))}
      </div>
      <CategoryIndicator categories={sections.map(({ category }) => category)} />
    </>
  )
}
