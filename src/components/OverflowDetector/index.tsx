/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:36:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-11 16:51:11
 * @Description: 判断文本是否溢出
 */
'use client';

import { Tooltip } from '@heroui/react';
import { track } from '@vercel/analytics';
import { memo, useEffect, useRef, useState } from 'react';

import { HOT_ITEMS } from '@/enums';
import { useIsMobile } from '@/hooks/use-is-mobile';

type OverflowDetectorProps = {
  record: App.HotListItem;
  type: typeof HOT_ITEMS.valueType;
};

const OverflowDetector = memo(function OverflowDetector({
  record,
  type,
}: OverflowDetectorProps) {
  const ref = useRef<HTMLDivElement>(null);

  // 判断是否是移动端
  const isMobile = useIsMobile();

  // 内容是否溢出
  const [isOverflowing, setIsOverflowing] = useState(false);

  // 点击标题回调
  const handleTitle = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    track(type);
  };

  // 只在组件挂载时检测一次 overflow
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkOverflow = () => {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    };

    // 等 DOM 渲染完成
    requestAnimationFrame(checkOverflow);
  }, []);

  return (
    <Tooltip delay={200} isDisabled={!isOverflowing}>
      <Tooltip.Trigger aria-label={record.title} className="min-w-0 flex-1">
        <div
          ref={ref}
          className="truncate transition-transform ease-in duration-300 cursor-pointer text-sm relative py-1 after:absolute after:content-[''] after:h-0.5 after:w-0 after:left-0 after:bottom-0 after:bg-border after:transition-[width] after:duration-500 hover:translate-x-1 hover:after:w-full"
          onClick={() => handleTitle(isMobile ? record.mobileUrl : record.url)}
          data-umami-event={type}
          data-umami-event-title={record.title}
          data-umami-event-url={record.url}
          data-umami-event-mobileurl={record.mobileUrl}
        >
          {record.title}
        </div>
      </Tooltip.Trigger>

      <Tooltip.Content placement="top">
        <Tooltip.Arrow />
        <p>{record.title}</p>
      </Tooltip.Content>
    </Tooltip>
  );
});

export default OverflowDetector;