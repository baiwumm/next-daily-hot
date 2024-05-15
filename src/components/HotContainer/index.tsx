/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-10 17:06:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-15 10:15:59
 * @Description: 热榜卡片
 */
'use client';

import { useState } from 'react';

import { useLocalStorageState } from 'ahooks';

import { LOCAL_KEY } from '@/utils/enum';
import type { HotListConfig, HotTypes } from '@/utils/types';

import HotCard from './HotCard';

import { hotCardConfig } from '@/utils';

const HotContainer = () => {
  // 不显示的榜单列表
  const [hiddenHotList] = useLocalStorageState<HotTypes[]>(LOCAL_KEY.HOTHIDDEN, {
    defaultValue: [],
  });
  /**
   * @description: 过滤掉不显示的热榜
   */
  const filterHiddenHot = (): HotListConfig[] => {
    return hiddenHotList?.length
      ? hotCardConfig.filter((config: HotListConfig) => !hiddenHotList.includes(config.value))
      : hotCardConfig;
  };
  const [hotConfig] = useState<HotListConfig[]>(filterHiddenHot());
  return hotConfig.map((config, index) => (
    <div
      key={config.value}
      className="animate-[showCard_0.5s_ease-in-out_forwards] opacity-0 translate-y-5"
      style={{ animationDelay: `${(index + 1) * 0.1 + 0.1}s` }}
    >
      <HotCard {...config} />
    </div>
  ));
};
export default HotContainer;
