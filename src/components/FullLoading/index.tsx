/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 09:05:12
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-20 15:06:52
 * @Description: 全屏加载
 */
'use client';
import { Spinner } from "@heroui/react";
import { useEffect, useState } from 'react';

const FullLoading = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // 判断组件是否挂载
  if (!mounted) {
    return (
      <div className="fixed flex w-screen h-screen justify-center items-center flex-col z-999 overflow-hidden card--default">
        <div className="flex flex-col items-center gap-2">
          <Spinner color="accent" />
          <span className="text-xs text-muted font-bold">正在加载,请稍后...</span>
        </div>
      </div>
    );
  }
  return null;
};
export default FullLoading;