/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 09:05:12
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-11 16:03:53
 * @Description: 全屏加载
 */
'use client';
import { Description, Spinner, useIsHydrated } from "@heroui/react";

const FullLoading = () => {
  const hydrated = useIsHydrated();

  // 判断组件是否挂载
  if (!hydrated) {
    return (
      <div className="fixed flex w-screen h-screen justify-center items-center flex-col z-999 overflow-hidden card--default">
        <div className="flex flex-col items-center gap-2">
          <Spinner color="accent" />
          <Description className="font-black">正在加载,请稍后...</Description>
        </div>
      </div>
    );
  }
  return null;
};
export default FullLoading;