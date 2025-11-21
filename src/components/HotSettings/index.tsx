/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 11:05:40
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 18:14:26
 * @Description: 热榜显示
 */
'use client';
import { Button, Image, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { RiLayoutLine } from "@remixicon/react";
import { useLocalStorageState } from 'ahooks';
import React from 'react';

import { hotCardConfig, LOCAL_KEY } from '@/lib/constant';
import type { HotTypes } from '@/lib/type';

export default function HotSettings() {
  const [hiddenValues, setHiddenValues] = useLocalStorageState<HotTypes[]>(LOCAL_KEY.HOTHIDDEN, {
    defaultValue: [],
    listenStorageChange: true
  });

  const hiddenSet = React.useMemo(() => new Set(hiddenValues), [hiddenValues]);

  const handleHotClick = (value: HotTypes) => {
    if (hiddenSet.has(value)) {
      setHiddenValues(hiddenValues.filter(v => v !== value));
    } else {
      setHiddenValues([...hiddenValues, value]);
    }
  };

  return (
    <Popover placement="bottom" showArrow classNames={{ content: ["p-3"] }}>
      <PopoverTrigger>
        <Button isIconOnly aria-label="热点榜单设置" variant="ghost" radius="full" size="sm">
          <RiLayoutLine size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid grid-cols-3 gap-2">
          {hotCardConfig.map(({ value, label }) => (
            <Button
              key={value}
              variant={hiddenSet.has(value) ? 'ghost' : 'flat'}
              startContent={
                <Image
                  src={`/${value}.svg`}
                  alt={label}
                  width={20}
                  height={20}
                  className="shrink-0"
                />
              }
              size="sm"
              className="justify-start"
              aria-label={`切换${label}榜单显示`}
              onPress={() => handleHotClick(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}