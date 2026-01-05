/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-04 15:16:22
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-04 15:19:10
 * @Description: 主体内容
 */
"use client"
import { type FC, type ReactNode } from 'react';

import { useAvailableHeight } from '@/hooks/use-available-height';

type MainContentProps = {
  children: ReactNode;
}

const MainContent: FC<MainContentProps> = ({ children }) => {
  // 计算主体内容高度
  const mainHeight = useAvailableHeight({
    elementIds: ['header', 'footer'],
    debounceMs: 150,
  });
  return (
    <main className="container! mx-auto p-4" style={{ minHeight: mainHeight }}>
      {children}
    </main>
  )
}
export default MainContent;