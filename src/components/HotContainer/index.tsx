/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-10 17:06:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-13 15:16:31
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
  return (
    <div className="w-96">
      {hotConfig.map((config) => (
        <HotCard {...config} key={config.value} />
      ))}
    </div>
  );
};
export default HotContainer;
