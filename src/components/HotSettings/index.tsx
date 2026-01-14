/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 11:05:40
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-14 16:01:44
 * @Description: 热榜显示
 */
'use client';
import { Button, Checkbox, CheckboxGroup, cn, Label, Modal } from "@heroui/react";
import { GripVertical, PanelsTopLeft, Settings } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';

import { Sortable, SortableItem, SortableItemHandle } from '@/components/Sortable';
import { HOT_ITEMS } from '@/enums';
import { useAppStore } from '@/store/useAppStore';

export default function HotSettings() {
  const hiddenItems = useAppStore(state => state.hiddenItems);
  const setHiddenItems = useAppStore(state => state.setHiddenItems);
  const sortItems = useAppStore(state => state.sortItems);
  const setSortItems = useAppStore(state => state.setSortItems);

  // 👇 当前「显示中的 items」
  const visibleValues = useMemo(() => {
    const hiddenSet = new Set(hiddenItems ?? []);
    return HOT_ITEMS.items
      .map(i => i.value)
      .filter(v => !hiddenSet.has(v));
  }, [hiddenItems]);

  // 点击回调
  const onChange = (values: string[]) => {
    const visibleSet = new Set(values);
    const allValues = HOT_ITEMS.items.map(i => i.value);

    // 👇 反推出 hiddenItems
    const nextHidden = allValues.filter(v => !visibleSet.has(v));
    setHiddenItems(nextHidden);
  }
  return (
    <Modal>
      <Button isIconOnly aria-label="热点榜单设置" variant="ghost" size="sm">
        <PanelsTopLeft />
      </Button>
      <Modal.Backdrop>
        <Modal.Container size='lg'>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                <div className="flex gap-2 items-center">
                  <Modal.Icon className="bg-default text-foreground">
                    <Settings className="size-5" />
                  </Modal.Icon>
                  <h1 className="font-bold">热榜设置</h1>
                </div>
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <CheckboxGroup name="hot-items" value={visibleValues} onChange={onChange}>
                <Sortable
                  value={sortItems}
                  onValueChange={(values) => setSortItems(values)}
                  getItemValue={(item) => item}
                  strategy="grid"
                  className="grid grid-cols-3 gap-3"
                >
                  {sortItems.map((value) => {
                    const raw = HOT_ITEMS.raw(value);
                    return (
                      <SortableItem key={value} value={value}>
                        <Checkbox
                          isOnSurface
                          value={value}
                          className={cn(
                            "group gap-2 rounded-md bg-surface px-2 py-3 transition-all border border-default mt-0",
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
                    )
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