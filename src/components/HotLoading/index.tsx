/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 15:08:57
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 15:08:59
 * @Description: 卡片加载
 */
import { Skeleton } from '@nextui-org/react';

const HotLoading = () => {
  return (
    <div className="space-y-5 p-5">
      <Skeleton className="w-3/5 h-4 rounded-lg" />
      <Skeleton className="w-3/5 h-4 rounded-lg" />
      <Skeleton className="w-full h-4 rounded-lg" />
      <Skeleton className="w-full h-4 rounded-lg" />
      <Skeleton className="w-full h-4 rounded-lg" />
      <Skeleton className="w-full h-4 rounded-lg" />
      <Skeleton className="w-full h-4 rounded-lg" />
      <Skeleton className="w-full h-4 rounded-lg" />
    </div>
  );
};
export default HotLoading;
