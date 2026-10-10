/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 11:05:40
 * @LastEditTime: 2026-10-10 09:42:57
 * @Description: 热榜显示（两层排序：分类层 ↑/↓ 调整顺序与整体显隐；平台层分类内拖拽排序与单独显隐）
 */
'use client'
import type { HotCategory, HotValue } from '@/config/hot-list'

import { ArrowDown, ArrowUp, BucketPaint, Gear, Grip, Star, StarFill, Xmark } from '@gravity-ui/icons'
import {
  AlertDialog,
  Button,
  Checkbox,
  Chip,
  cn,
  Label,
  Modal,
  toast,
  Tooltip,
  Typography,
  Description,
  Surface,
} from '@heroui/react'
import { motion } from 'motion/react'
import NumberFlow from '@number-flow/react'
import { useMemo } from 'react'

import { Sortable, SortableItem, SortableItemHandle } from '@/components/Sortable'
import { getCategoryValues, getOrderedCategories, HOT_CATEGORY_LIST, HOT_ITEMS } from '@/config/hot-list'
import { useAppStore } from '@/store/useAppStore'

const MotionSurface = motion.create(Surface)

export default function HotSettings() {
  const hiddenItems = useAppStore((state) => state.hiddenItems)
  const setHiddenItems = useAppStore((state) => state.setHiddenItems)
  const sortItems = useAppStore((state) => state.sortItems)
  const setSortItems = useAppStore((state) => state.setSortItems)
  const categoryOrder = useAppStore((state) => state.categoryOrder)
  const setCategoryOrder = useAppStore((state) => state.setCategoryOrder)
  const favoriteItems = useAppStore((state) => state.favoriteItems)
  const setFavoriteItems = useAppStore((state) => state.setFavoriteItems)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)

  // 分区块数据：分类顺序 × 块内平台顺序（读取时归一化，含隐藏平台——复选框要能对隐藏项反向勾选）
  const sections = useMemo(
    () =>
      getOrderedCategories(categoryOrder).map((category) => ({
        category,
        values: getCategoryValues(sortItems, category),
      })),
    [categoryOrder, sortItems],
  )

  /** 分类层 ↑/↓：与相邻分类交换位置 */
  const moveCategory = (category: HotCategory, direction: -1 | 1) => {
    const index = sections.findIndex((section) => section.category === category)
    const target = index + direction

    if (index < 0 || target < 0 || target >= sections.length) return

    const next = [...sections]

    ;[next[index], next[target]] = [next[target], next[index]]
    setCategoryOrder(next.map(({ category: value }) => value))
  }

  /** 分类层显隐：勾选 = 清空该分类所有平台的隐藏标记；取消 = 全部隐藏（hiddenItems 单一数据源） */
  const toggleCategory = (category: HotCategory, checked: boolean) => {
    const members = new Set(getCategoryValues(sortItems, category))

    setHiddenItems(
      checked
        ? hiddenItems.filter((value) => !members.has(value))
        : [...hiddenItems.filter((value) => !members.has(value)), ...members],
    )
    toast.success('操作成功！', { timeout: 2000 })
  }

  /** 平台层：分类内拖拽排序（平台不可跨分类，重写扁平顺序时其他分类块保持原样） */
  const reorderPlatforms = (category: HotCategory, nextMembers: HotValue[]) => {
    setSortItems(sections.flatMap((section) => (section.category === category ? nextMembers : section.values)))
  }

  /** 平台层显隐 */
  const togglePlatform = (value: HotValue, checked: boolean) => {
    setHiddenItems(checked ? hiddenItems.filter((item) => item !== value) : [...hiddenItems, value])
  }

  // 恢复默认设置
  const resetConfig = () => {
    setCategoryOrder([...HOT_CATEGORY_LIST])
    setSortItems(HOT_ITEMS.values)
    setHiddenItems([])
    setFavoriteItems([])
    toast.success('操作成功！', {
      timeout: 2000,
    })
  }

  return (
    <Modal>
      {/* Tooltip 只包裹触发按钮，不能包裹整个 Modal：Modal 的 backdrop/弹窗经 portal 渲染，
          但在 React 树中仍是 Tooltip 触发元素的后代，会导致弹窗内 hover 误触发 Tooltip */}
      <Tooltip delay={0}>
        <Button isIconOnly aria-label="热榜设置" size="sm" variant="ghost">
          <BucketPaint />
        </Button>
        <Tooltip.Content showArrow>
          <Tooltip.Arrow />
          热榜设置
        </Tooltip.Content>
      </Tooltip>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog className="sm:max-w-2xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                <div className="flex items-center gap-2">
                  <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                    <Gear />
                  </Modal.Icon>
                  <h1 className="font-bold">热榜设置</h1>
                </div>
                <Description>
                  星标收藏的常看平台置顶聚合，并从原分类移入常看；分类用箭头调整顺序与显隐，平台行可拖拽排序、点星标收藏、勾选控制显隐。
                </Description>
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="space-y-3 overscroll-contain">
              {/* 常看管理：跨分类收藏的平台置顶聚合，拖拽调整顺序，× 移除（星标入口在每张卡片底部刷新按钮旁） */}
              <Surface className="flex flex-col gap-2.5 rounded-2xl border p-4" variant="transparent">
                <div className="flex items-center gap-2">
                  <StarFill className="text-warning" width={14} />
                  <h2 className="font-black">常看</h2>
                  <Chip className="ml-auto" size="sm" variant="soft">
                    <NumberFlow value={favoriteItems.length} />
                  </Chip>
                </div>
                {favoriteItems.length ? (
                  <Sortable
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2"
                    getItemValue={(item) => item}
                    strategy="grid"
                    value={favoriteItems}
                    onValueChange={setFavoriteItems}
                  >
                    {favoriteItems.map((value) => {
                      const raw = HOT_ITEMS.raw(value)

                      if (!raw) return null

                      return (
                        <SortableItem key={value} value={value}>
                          {/* layout：收藏/移除常看时剩余条目 FLIP 平滑滑动，与分类块拖拽重排同一弹簧参数 */}
                          <motion.div
                            layout
                            className="h-full"
                            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                          >
                            <div className="flex items-center gap-1 border border-default bg-surface px-2 py-2.5 rounded-xl">
                              <SortableItemHandle className="text-muted-foreground shrink-0">
                                <Grip width={16} />
                              </SortableItemHandle>
                              <img
                                alt={raw.label}
                                className="rounded-md shrink-0"
                                height={16}
                                src={`/images/${value}.svg`}
                                width={16}
                              />
                              <Label className="flex-1 text-xs truncate">{raw.label}</Label>
                              <Button
                                isIconOnly
                                aria-label={`移除常看：${raw.label}`}
                                className="text-muted size-5"
                                size="sm"
                                variant="ghost"
                                onPress={() => toggleFavorite(value)}
                              >
                                <Xmark width={12} />
                              </Button>
                            </div>
                          </motion.div>
                        </SortableItem>
                      )
                    })}
                  </Sortable>
                ) : (
                  <Typography className="block py-1 text-center" color="muted" type="body-sm">
                    点击卡片底部刷新按钮旁的星标，把常看的平台聚合到首页顶部
                  </Typography>
                )}
              </Surface>
              {sections.map(({ category, values }, index) => {
                const hiddenCount = values.filter((value) => hiddenItems.includes(value)).length
                const allHidden = hiddenCount === values.length
                const someHidden = hiddenCount > 0 && !allHidden

                return (
                  // layout：↑/↓ 交换分类时 FLIP 平滑滑动，不做生硬跳变
                  <MotionSurface
                    key={category}
                    layout
                    className="flex flex-col gap-2.5 rounded-2xl border p-4"
                    transition={{ layout: { type: 'spring', stiffness: 350, damping: 34 } }}
                    variant="transparent"
                  >
                    {/* 分类头：显隐 Checkbox + 分类名，↑/↓ 水平排列在标题后（部分隐藏时半选态）+ 显示计数 */}
                    <div className="flex items-center gap-2">
                      <Checkbox
                        aria-label={`显示分类：${category}`}
                        isIndeterminate={someHidden}
                        isSelected={!allHidden}
                        variant="secondary"
                        onChange={(checked) => toggleCategory(category, checked)}
                      >
                        <Checkbox.Content className="flex items-center gap-2">
                          <Checkbox.Control className="size-4">
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <h2 className="font-black">{category}</h2>
                        </Checkbox.Content>
                      </Checkbox>
                      <div className="flex gap-0.5">
                        <Button
                          isIconOnly
                          aria-label={`上移分类：${category}`}
                          className="text-muted size-6 min-w-6"
                          isDisabled={index === 0}
                          size="sm"
                          variant="ghost"
                          onPress={() => moveCategory(category, -1)}
                        >
                          <ArrowUp />
                        </Button>
                        <Button
                          isIconOnly
                          aria-label={`下移分类：${category}`}
                          className="text-muted size-6 min-w-6"
                          isDisabled={index === sections.length - 1}
                          size="sm"
                          variant="ghost"
                          onPress={() => moveCategory(category, 1)}
                        >
                          <ArrowDown />
                        </Button>
                      </div>
                      <Typography className="ml-auto" color="muted" type="body-sm">
                        <NumberFlow value={values.length - hiddenCount} />/{values.length}
                      </Typography>
                    </div>
                    {/* 平台层：分类内拖拽排序 + 单独显隐（样式与初版单行一致，分类归属由区块本身表达） */}
                    <Sortable
                      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2"
                      getItemValue={(item) => item}
                      strategy="grid"
                      value={values}
                      onValueChange={(next) => reorderPlatforms(category, next)}
                    >
                      {values.map((value) => {
                        const raw = HOT_ITEMS.raw(value)

                        if (!raw) return null

                        return (
                          <SortableItem key={value} value={value}>
                            {/* layout：拖拽落下重排时平台 FLIP 滑动到新位置（dnd-kit 的变换作用在外层，互不冲突） */}
                            <motion.div
                              layout
                              className="h-full"
                              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                            >
                              <Checkbox
                                className={cn(
                                  'group mt-0 gap-2 border border-default bg-surface px-2 py-3 transition-all rounded-xl',
                                  'data-[selected=true]:bg-accent-soft hover:bg-accent-soft',
                                )}
                                isSelected={!hiddenItems.includes(value)}
                                variant="secondary"
                                onChange={(selected) => togglePlatform(value, selected)}
                              >
                                <Checkbox.Content className="flex flex-row items-center justify-between gap-1 w-full">
                                  <div className="flex items-center gap-1 min-w-0">
                                    <SortableItemHandle className="text-muted-foreground shrink-0">
                                      <Grip width={16} />
                                    </SortableItemHandle>
                                    <img
                                      alt={raw.label}
                                      className="rounded-md shrink-0"
                                      height={16}
                                      src={`/images/${value}.svg`}
                                      width={16}
                                    />
                                    <Label className="flex-1 text-xs truncate">{raw.label}</Label>
                                  </div>
                                  {/* 星标与勾选框成组靠右对齐 */}
                                  <div className="flex items-center gap-1 shrink-0">
                                    {/* 行内星标：就地收藏/取消常看，与卡片底部星标同一语义（收藏后平台移入常看分节） */}
                                    <Tooltip delay={0}>
                                      <Button
                                        isIconOnly
                                        aria-label={
                                          favoriteItems.includes(value)
                                            ? `取消常看：${raw.label}`
                                            : `设为常看：${raw.label}`
                                        }
                                        className={cn(
                                          'size-4 min-w-4',
                                          favoriteItems.includes(value) ? 'text-warning' : 'text-muted',
                                        )}
                                        size="sm"
                                        variant="ghost"
                                        onPress={() => toggleFavorite(value)}
                                      >
                                        {favoriteItems.includes(value) ? <StarFill width={12} /> : <Star width={12} />}
                                      </Button>
                                      <Tooltip.Content showArrow>
                                        <Tooltip.Arrow />
                                        {favoriteItems.includes(value) ? '取消常看' : '设为常看'}
                                      </Tooltip.Content>
                                    </Tooltip>
                                    <Checkbox.Control className="size-4 shrink-0">
                                      <Checkbox.Indicator />
                                    </Checkbox.Control>
                                  </div>
                                </Checkbox.Content>
                              </Checkbox>
                            </motion.div>
                          </SortableItem>
                        )
                      })}
                    </Sortable>
                  </MotionSurface>
                )
              })}
            </Modal.Body>
            <Modal.Footer>
              <AlertDialog>
                <Button className="w-full">恢复默认设置</Button>
                <AlertDialog.Backdrop variant="blur">
                  <AlertDialog.Container size="md">
                    <AlertDialog.Dialog>
                      <AlertDialog.CloseTrigger />
                      <AlertDialog.Header>
                        <AlertDialog.Icon status="warning" />
                        <AlertDialog.Heading>恢复默认设置？</AlertDialog.Heading>
                      </AlertDialog.Header>
                      <AlertDialog.Body>
                        该操作会重置热榜的分类顺序、平台排序、显示配置与常看收藏，并恢复为系统默认状态。
                      </AlertDialog.Body>
                      <AlertDialog.Footer>
                        <Button slot="close" variant="tertiary">
                          取消
                        </Button>
                        <Button slot="close" variant="danger" onPress={resetConfig}>
                          确认
                        </Button>
                      </AlertDialog.Footer>
                    </AlertDialog.Dialog>
                  </AlertDialog.Container>
                </AlertDialog.Backdrop>
              </AlertDialog>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
