/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-13 18:07:42
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 16:01:49
 * @Description: 判断文本是否溢出
 */
'use client';

import { useEffect, useState, useRef } from 'react';

import { Tooltip } from '@nextui-org/react';

import useIsMobile from '@/hooks/useIsMobile';

type OverflowDetectorProps = {
  children: string;
  url: string;
  mobileUrl: string;
};

const OverflowDetector = ({ children, url, mobileUrl }: OverflowDetectorProps) => {
  const ref = useRef<HTMLInputElement>(null);
  // 判断是否是移动端
  const isMobile = useIsMobile();
  // 内容是否溢出
  const [isOverflowing, setIsOverflowing] = useState(false);

  // 判断是否溢出
  const handleOverflow = () => {
    const element = ref.current;
    if (element) {
      setIsOverflowing(element.scrollWidth > element.clientWidth);
    }
  };

  useEffect(() => {
    handleOverflow();
  }, [children]); // 监听children的变化，如果children变化，重新检测

  return (
    <Tooltip showArrow content={children} placement="top" isDisabled={!isOverflowing}>
      <div
        ref={ref}
        className="transition ease-in duration-300 cursor-pointer text-sm whitespace-nowrap self-start overflow-hidden text-ellipsis flex-auto relative py-1 after:absolute after:content-[''] after:h-0.5 after:w-0 after:left-0 after:-bottom-0 after:bg-slate-200 after:transition-all after:duration-500 hover:translate-x-1 hover:after:w-full"
        onClick={() => window.open(isMobile ? mobileUrl : url)}
      >
        {children}
      </div>
    </Tooltip>
  );
};

export default OverflowDetector;
