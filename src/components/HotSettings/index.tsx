/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 11:05:40
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-14 17:22:35
 * @Description: 热榜显示
 */
'use client';
import { Button, Checkbox, CheckboxGroup, cn, Label, Modal } from "@heroui/react";
import { GripVertical, PanelsTopLeft, Settings } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';

import { Sortable, SortableItem, SortableItemHandle } from '@/components/Sortable';
import { HOT_ITEMS } from '@/enums';
import { useAppStore } from '@/store/useAppStore';

type HotKeys = typeof HOT_ITEMS.valueType;

/**
 * 👇 核心：排序归一化
 * - 保留旧顺序
 * - 自动补齐新增项
 * - 自动剔除已删除项
 */
function normalizeSortItems(source: HotKeys[], sortItems?: HotKeys[]) {
  const sourceSet = new Set(source);

  // 保留仍然存在的排序项
  const normalized = (sortItems ?? []).filter(v => sourceSet.has(v));

  // 找出新增项
  const missing = source.filter(v => !normalized.includes(v));

  return [...normalized, ...missing];
}

export default function HotSettings() {
  const hiddenItems = useAppStore(state => state.hiddenItems);
  const setHiddenItems = useAppStore(state => state.setHiddenItems);
  const sortItems = useAppStore(state => state.sortItems);
  const setSortItems = useAppStore(state => state.setSortItems);

  /**
   * 👇 源数据（唯一可信）
   */
  const sourceValues = useMemo(
    () => HOT_ITEMS.items.map(i => i.value),
    []
  );

  /**
   * 👇 排序兜底（解决你新增一条 HOT_ITEMS 不显示的问题）
   */
  const safeSortItems = useMemo(
    () => normalizeSortItems(sourceValues, sortItems),
    [sourceValues, sortItems]
  );

  /**
   * 👇 隐藏项兜底（防止源数据删了还留在 hiddenItems）
   */
  const safeHiddenItems = useMemo(() => {
    const sourceSet = new Set(sourceValues);
    return (hiddenItems ?? []).filter(v => sourceSet.has(v));
  }, [hiddenItems, sourceValues]);

  /**
   * 👇 当前显示中的 items（CheckboxGroup 使用）
   */
  const visibleValues = useMemo(() => {
    const hiddenSet = new Set(safeHiddenItems);
    return sourceValues.filter(v => !hiddenSet.has(v));
  }, [safeHiddenItems, sourceValues]);

  /**
   * 👇 勾选变化 → 反推出 hiddenItems
   */
  const onChange = (values: string[]) => {
    const visibleSet = new Set(values);
    const nextHidden = sourceValues.filter(v => !visibleSet.has(v));
    setHiddenItems(nextHidden);
  };

  /**
   * 👇（可选但强烈推荐）
   * 当发现 sortItems 不完整时，自动修复 store
   * 新增项会被持久化，不只是 UI 显示
   */
  useEffect(() => {
    if (!sortItems) return;

    if (safeSortItems.join() !== sortItems.join()) {
      setSortItems(safeSortItems);
    }
  }, [safeSortItems]);

  return (
    <Modal>
      <Button
        isIconOnly
        aria-label="热点榜单设置"
        variant="ghost"
        size="sm"
      >
        <PanelsTopLeft />
      </Button>

      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading>
                <div className="flex items-center gap-2">
                  <Modal.Icon className="bg-default text-foreground">
                    <Settings className="size-5" />
                  </Modal.Icon>
                  <h1 className="font-bold">热榜设置</h1>
                </div>
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <CheckboxGroup
                name="hot-items"
                value={visibleValues}
                onChange={onChange}
              >
                <Sortable
                  value={safeSortItems}
                  onValueChange={setSortItems}
                  getItemValue={(item) => item}
                  strategy="grid"
                  className="grid grid-cols-3 gap-3"
                >
                  {safeSortItems.map((value) => {
                    const raw = HOT_ITEMS.raw(value);
                    if (!raw) return null;

                    return (
                      <SortableItem key={value} value={value}>
                        <Checkbox
                          isOnSurface
                          value={value}
                          className={cn(
                            "group mt-0 gap-2 rounded-md border border-default bg-surface px-2 py-3 transition-all",
                            "data-[selected=true]:bg-accent/10 hover:bg-accent/10",
                          )}
                        >
                          <Checkbox.Content className="flex flex-row items-center justify-between gap-1 w-full h-full">
                            <div className="flex items-center gap-1 min-w-0">
                              <SortableItemHandle className="text-muted-foreground shrink-0">
                                <GripVertical className="h-3.5 w-3.5" />
                              </SortableItemHandle>
                              <Image
                                src={`/${value}.svg`}
                                alt={raw.label}
                                width={16}
                                height={16}
                                className="shrink-0"
                              />
                              <Label className="flex-1 text-xs truncate">{raw.label}</Label>
                            </div>
                            <Checkbox.Control className="size-4 rounded-sm before:rounded-sm shrink-0">
                              <Checkbox.Indicator />
                            </Checkbox.Control>
                          </Checkbox.Content>
                        </Checkbox>
                      </SortableItem>
                    );
                  })}
                </Sortable>
              </CheckboxGroup>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}