/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-12 15:12:53
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-26 15:11:13
 * @Description: 动态列表子项
 */
import { cn } from '@heroui/react';
import { type ReactNode } from 'react';
import { type RowComponentProps } from 'react-window';

import OverflowDetector from '@/components/OverflowDetector';
import { HOT_ITEMS } from '@/enums';
import { formatNumber, hotLableColor, hotTagColor } from '@/lib/utils';

const renderHot = (value: string | number, prefix?: ReactNode, suffix?: ReactNode) => (
  <div className="shrink-0 text-xs text-black/45 dark:text-white flex items-center gap-0.5">
    {prefix}{value}{suffix}
  </div>
);

const RowComponent = ({ index, style, data, isLight = false, value, prefix, suffix }: RowComponentProps<{
  data: App.HotListItem[];
  isLight: boolean;
  value: typeof HOT_ITEMS.valueType;
  prefix?: string;
  suffix?: string;
}>) => {
  const item = data[index];
  const { label } = item;
  const isLast = index === data.length - 1;

  // 渲染热度
  const renderEndContent = (hot?: number | string, tip?: string) => hot
    ? renderHot(formatNumber(hot))
    : tip
      ? renderHot(tip, prefix, suffix)
      : null;

  // 默认背景色
  const labelBgColor = !isLight ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0,0,0,.05)';
  return (
    <div style={style} className={cn(
      'flex group justify-between items-center gap-1 min-w-0 py-1.5 w-full border-b border-default',
      isLast && 'border-none'
    )}>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div
          className="text-xs size-6 rounded shrink-0 flex items-center justify-center"
          style={{
            backgroundColor: label
              ? (hotLableColor[label] || labelBgColor)
              : hotTagColor[index] ||
              labelBgColor,
            color:
              isLight && (label ? hotLableColor[label] : hotTagColor[index])
                ? 'var(--white)'
                : 'text-default-foreground',
          }}
        >
          {label ? label.slice(0, 1) : index + 1}
        </div>

        <OverflowDetector record={item} type={value}>
          {item.title}
        </OverflowDetector>
      </div>

      {renderEndContent(item.hot, item.tip)}
    </div>
  )
}

export default RowComponent;
