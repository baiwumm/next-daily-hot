/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-10 17:06:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-15 16:51:01
 * @Description: 热榜卡片
 */
import HotCard from './HotCard';

import { hotCardConfig } from '@/utils';

const HotContainer = () => {
  return hotCardConfig.map((config, index) => (
    <div
      key={config.value}
      className="animate-[showCard_0.5s_ease-in-out_forwards] opacity-0"
      style={{ animationDelay: `${(index + 1) * 0.1 + 0.1}s` }}
    >
      <HotCard {...config} />
    </div>
  ));
};
export default HotContainer;
