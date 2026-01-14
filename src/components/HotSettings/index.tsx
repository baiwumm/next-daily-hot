/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 11:05:40
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-14 12:04:36
 * @Description: 热榜显示
 */
'use client';
import { Button, Checkbox, CheckboxGroup, cn, Label, Popover } from "@heroui/react";
import { PanelsTopLeft } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';

import { HOT_ITEMS } from '@/enums';
import { useAppStore } from '@/store/useAppStore';

export default function HotSettings() {
  const hiddenItems = useAppStore(state => state.hiddenItems);
  const setHiddenItems = useAppStore(state => state.setHiddenItems);

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
    <Popover>
      <Button isIconOnly aria-label="热点榜单设置" variant="ghost" size="sm">
        <PanelsTopLeft />
      </Button>
      <Popover.Content placement="bottom" className="rounded-lg">
        <Popover.Dialog>
          <Popover.Arrow />
          <CheckboxGroup name="hot-items" value={visibleValues} onChange={onChange}>
            <div className="grid grid-cols-3 gap-2">
              {HOT_ITEMS.items.map(({ value, raw }) => (
                <Checkbox
                  key={value}
                  isOnSurface
                  value={value}
                  className={cn(
                    "group gap-2 rounded-md bg-surface px-2 py-2 transition-all border border-default mt-0",
                    "data-[selected=true]:bg-accent/10 hover:bg-accent/10",
                  )}
                >
                  <Checkbox.Content className="flex flex-row items-center justify-between gap-1 w-full h-full">
                    <div className="flex items-center gap-1">
                      <Image
                        src={`/${value}.svg`}
                        alt={raw.label}
                        width={16}
                        height={16}
                        className="shrink-0"
                      />
                      <Label className="text-xs">{raw.label}</Label>
                    </div>
                    <Checkbox.Control className="size-4 rounded-sm before:rounded-sm shrink-0">
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                  </Checkbox.Content>
                </Checkbox>
              ))}
            </div>
          </CheckboxGroup>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}