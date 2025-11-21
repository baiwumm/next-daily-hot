/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:36:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 17:33:43
 * @Description: 判断文本是否溢出
 */
'use client';

import { Tooltip } from '@heroui/react';
import { track } from '@vercel/analytics';
import { useEffect, useRef, useState } from 'react';

import { useIsMobile } from '@/hooks/useIsMobile';
import type { HotListItem, HotTypes } from '@/lib/type';

type OverflowDetectorProps = {
  children: string;
  record: HotListItem;
  type: HotTypes;
};

const OverflowDetector = ({ children, record, type }: OverflowDetectorProps) => {
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

  // 点击标题回调
  const handleTitle = (url: string) => {
    window.open(url);
    track(type);
  };

  useEffect(() => {
    handleOverflow();
  }, [children]); // 监听children的变化，如果children变化，重新检测

  return (
    <Tooltip showArrow content={children} placement="top" isDisabled={!isOverflowing}>
      <div
        ref={ref}
        className="min-w-0 transition ease-in duration-300 cursor-pointer text-sm whitespace-nowrap self-start overflow-hidden text-ellipsis flex-1 relative py-1 after:absolute after:content-[''] after:h-0.5 after:w-0 after:left-0 after:bottom-0 after:bg-slate-200 after:transition-all after:duration-500 hover:translate-x-1 hover:after:w-full"
        onClick={() => handleTitle(isMobile ? record.mobileUrl : record.url)}
        data-umami-event={type}
        data-umami-event-title={record.title}
        data-umami-event-url={record.url}
        data-umami-event-mobileUrl={record.mobileUrl}
      >
        {children}
      </div>
    </Tooltip>
  );
};

export default OverflowDetector;