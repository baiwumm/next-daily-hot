/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 11:05:40
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-10-07 18:14:28
 * @Description: 热榜显示
 */
'use client'
import type { HotValue } from '@/enums'

import { BucketPaint, Gear, Grip } from '@gravity-ui/icons'
import {
  AlertDialog,
  Button,
  Checkbox,
  CheckboxGroup,
  cn,
  Label,
  Modal,
  toast,
  Tooltip,
  Typography,
} from '@heroui/react'
import Image from 'next/image'
import { useEffect, useMemo } from 'react'

import { Sortable, SortableItem, SortableItemHandle } from '@/components/Sortable'
import { HOT_ITEMS } from '@/enums'
import { useAppStore } from '@/store/useAppStore'

/** 源数据（唯一可信）：HOT_ITEMS 是模块常量，直接提升，避免每次渲染重算 */
const SOURCE_VALUES = HOT_ITEMS.items.map((item) => item.value)

export default function HotSettings() {
  const hiddenItems = useAppStore((state) => state.hiddenItems)
  const setHiddenItems = useAppStore((state) => state.setHiddenItems)
  const sortItems = useAppStore((state) => state.sortItems)
  const setSortItems = useAppStore((state) => state.setSortItems)

  /**
   * 👇 排序兜底（解决你新增一条 HOT_ITEMS 不显示的问题）
   */
  const safeSortItems = useMemo(() => normalizeSortItems(SOURCE_VALUES, sortItems), [sortItems])

  /**
   * 👇 隐藏项兜底（防止源数据删了还留在 hiddenItems）
   */
  const safeHiddenItems = useMemo(() => {
    const sourceSet = new Set(SOURCE_VALUES)

    return (hiddenItems ?? []).filter((v) => sourceSet.has(v))
  }, [hiddenItems])

  /**
   * 👇 当前显示中的 items（CheckboxGroup 使用）
   */
  const visibleValues = useMemo(() => {
    const hiddenSet = new Set(safeHiddenItems)

    return SOURCE_VALUES.filter((v) => !hiddenSet.has(v))
  }, [safeHiddenItems])

  /**
   * 👇 勾选变化 → 反推出 hiddenItems
   */
  const onChange = (values: string[]) => {
    const visibleSet = new Set(values)
    const nextHidden = SOURCE_VALUES.filter((v) => !visibleSet.has(v))

    setHiddenItems(nextHidden)
  }

  // 恢复默认设置
  const resetConfig = () => {
    setSortItems(HOT_ITEMS.values)
    setHiddenItems([])
    toast.success('操作成功！', {
      timeout: 2000,
    })
  }

  /**
   * 👇（可选但强烈推荐）
   * 当发现 sortItems 不完整时，自动修复 store
   * 新增项会被持久化，不只是 UI 显示
   */
  useEffect(() => {
    if (!sortItems) return

    if (safeSortItems.join() !== sortItems.join()) {
      setSortItems(safeSortItems)
    }
  }, [safeSortItems, sortItems, setSortItems])

  return (
    <Modal>
      {/* Tooltip 只包裹触发按钮，不能包裹整个 Modal：Modal 的 backdrop/弹窗经 portal 渲染，
          但在 React 树中仍是 Tooltip 触发元素的后代，会导致弹窗内 hover 误触发 Tooltip */}
      <Tooltip delay={0}>
        <Tooltip.Trigger aria-label="热榜设置">
          <Button isIconOnly aria-label="热榜设置" size="sm" variant="ghost">
            <BucketPaint />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content showArrow>
          <Tooltip.Arrow />
          热榜设置
        </Tooltip.Content>
      </Tooltip>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                <div className="flex items-center gap-2">
                  <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                    <Gear />
                  </Modal.Icon>
                  <h1 className="font-bold">热榜设置</h1>
                </div>
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <CheckboxGroup name="hot-items" value={visibleValues} onChange={onChange}>
                <Sortable
                  className="grid grid-cols-2 gap-3"
                  getItemValue={(item) => item}
                  strategy="grid"
                  value={safeSortItems}
                  onValueChange={setSortItems}
                >
                  {safeSortItems.map((value) => {
                    const raw = HOT_ITEMS.raw(value)
                    // category 挂在分组配置上而非 raw 子项，从 items 索引取
                    const category = HOT_ITEMS.items.find((item) => item.value === value)?.category

                    if (!raw || !category) return null

                    return (
                      <SortableItem key={value} value={value}>
                        <Checkbox
                          className={cn(
                            'group mt-0 border border-default bg-surface px-3 py-2.5 transition-all rounded-xl',
                            'data-[selected=true]:bg-accent-soft hover:bg-accent-soft',
                          )}
                          value={value}
                        >
                          <Checkbox.Content className="flex items-center gap-2.5 w-full">
                            <SortableItemHandle className="text-muted-foreground shrink-0">
                              <Grip width={14} />
                            </SortableItemHandle>
                            <Image
                              alt={raw.label}
                              className="rounded shrink-0"
                              height={20}
                              src={`/images/${value}.svg`}
                              width={20}
                            />
                            {/* 分类标签：仅作归属提示，不参与拖拽排序（全局排序语义保持不变）；
                                Checkbox 是字段组件，内部 Text 必须声明 slot，否则 RAC 抛错 */}
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <Label className="text-sm truncate">{raw.label}</Label>
                                <Checkbox.Control className="size-4 shrink-0">
                                  <Checkbox.Indicator />
                                </Checkbox.Control>
                              </div>
                              <Typography className="truncate" color="muted" slot="description" type="body-sm">
                                {category}
                              </Typography>
                            </div>
                          </Checkbox.Content>
                        </Checkbox>
                      </SortableItem>
                    )
                  })}
                </Sortable>
              </CheckboxGroup>
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
                      <AlertDialog.Body>该操作会重置热榜的排序与显示配置，并恢复为系统默认状态。</AlertDialog.Body>
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

/**
 * 👇 核心：排序归一化
 * - 保留旧顺序
 * - 自动补齐新增项
 * - 自动剔除已删除项
 */
function normalizeSortItems(source: HotValue[], sortItems?: HotValue[]) {
  const sourceSet = new Set(source)

  // 保留仍然存在的排序项
  const normalized = (sortItems ?? []).filter((v) => sourceSet.has(v))
  const normalizedSet = new Set(normalized)

  // 找出新增项
  const missing = source.filter((v) => !normalizedSet.has(v))

  return [...normalized, ...missing]
}
