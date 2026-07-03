/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-12 15:12:53
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-03 14:41:11
 * @Description: 动态列表子项
 */
import { Description } from '@heroui/react';
import { type ReactNode, useMemo } from 'react';
import { type RowComponentProps } from 'react-window';

import OverflowDetector from '@/components/OverflowDetector';
import { HOT_ITEMS } from '@/enums';
import { formatNumber, hotLableColor, hotTagColor } from '@/lib/utils';

interface RowData {
  data: App.HotListItem[];
  value: typeof HOT_ITEMS.valueType;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

const HotDisplay = ({
  value,
  prefix,
  suffix
}: {
  value: string | number;
  prefix?: ReactNode;
  suffix?: ReactNode;
}) => (
  <Description className="shrink-0 flex items-center gap-0.5">
    {prefix}{value}{suffix}
  </Description>
);

const RowComponent = ({ index, style, data, value, prefix, suffix }: RowComponentProps<RowData>) => {
  const item = useMemo(() => data[index], [data, index]);
  const { label } = item;

  const colorStyle = useMemo(() => {
    const bgColor = label
      ? (hotLableColor[label as keyof typeof hotLableColor] || 'var(--default)')
      : hotTagColor[index] || 'var(--default)';

    const textColor = (label ? hotLableColor[label as keyof typeof hotLableColor] : hotTagColor[index])
      ? 'var(--white)'
      : 'var(--default-foreground)';

    return { backgroundColor: bgColor, color: textColor };
  }, [label, index]);

  const displayText = useMemo(() => {
    return label ? label.slice(0, 1) : index + 1;
  }, [label, index]);

  const endContent = useMemo(() => {
    if (item.hot) {
      return <HotDisplay value={formatNumber(item.hot)} />;
    }
    if (item.tip) {
      return <HotDisplay value={item.tip} prefix={prefix} suffix={suffix} />;
    }
    return null;
  }, [item.hot, item.tip, prefix, suffix]);

  return (
    <div
      style={style}
      className="flex group justify-between items-center gap-1 min-w-0 py-1.5 w-full border-b border-default"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div
          className="text-xs size-6 rounded shrink-0 flex items-center justify-center"
          style={colorStyle}
        >
          {displayText}
        </div>
        <OverflowDetector record={item} type={value} />
      </div>
      {endContent}
    </div>
  );
};

export default RowComponent;
