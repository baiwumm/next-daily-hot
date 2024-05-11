/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-08 17:12:20
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-11 09:40:24
 * @Description: 入口页面
 */
import HotCard from '@/components/HotCard'; // 热榜卡片

export default function Home() {
  return (
    <div className="grid px-4 md:px-12 lg:px-20 gap-5 py-5">
      <HotCard />
    </div>
  );
}
