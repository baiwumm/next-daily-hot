/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 09:05:12
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 09:06:45
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
      <div className="fixed flex w-screen h-screen justify-center items-center flex-col z-999 overflow-hidden bg-white dark:bg-slate-900">
        <Spinner label='正在加载,请稍后...' variant="gradient" size="lg" color='primary' />
      </div>
    );
  }
  return null;
};
export default FullLoading;