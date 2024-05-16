/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-10 17:06:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-16 14:06:05
 * @Description: 热榜卡片
 */
import TransitionWrapper from '@/components/TransitionWrapper';

import HotCard from './HotCard';

import { hotCardConfig } from '@/utils';

const HotContainer = () => {
  return hotCardConfig.map((config, index) => (
    <TransitionWrapper key={config.value} delay={(index + 1) * 0.1 + 0.1}>
      <HotCard {...config} />
    </TransitionWrapper>
  ));
};
export default HotContainer;
