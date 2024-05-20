/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-20 10:29:20
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-20 13:44:01
 * @Description: 全局 Loading
 */
'use client';

import { useState, useEffect } from 'react';

const FullLoading = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 判断组件是否挂载
  if (!mounted) {
    return (
      <div className="fixed flex w-screen h-screen justify-center items-center flex-col z-[99] overflow-hidden bg-white dark:bg-slate-900">
        <div className="relative w-12 h-12 rotate-[165deg] before:content-[''] after:content-[''] before:absolute after:absolute before:top-2/4 after:top-2/4 before:left-2/4 after:left-2/4 before:block after:block before:w-[.5em] after:w-[.5em] before:h-[.5em] after:h-[.5em] before:rounded after:rounded before:-translate-x-1/2 after:-translate-x-1/2 before:-translate-y-2/4 after:-translate-y-2/4 before:animate-[loaderBefore_2s_infinite] after:animate-[loaderAfter_2s_infinite]"></div>
      </div>
    );
  }
  return null;
};
export default FullLoading;
