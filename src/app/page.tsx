/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-08 17:12:20
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-13 14:01:15
 * @Description: 入口页面
 */
import HotContainer from '@/components/HotContainer'; // 热榜卡片

export default function Home() {
  return (
    <div className="grid px-4 md:px-12 lg:px-20 gap-5 py-5">
      <div className="w-96">
        <HotContainer />
      </div>
    </div>
  );
}
