import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

import RowComponent from './RowComponent';

import { HOT_ITEMS } from '@/enums';

export default function HotListVirtual({
  data,
  value,
  prefix,
  suffix,
}: {
  data: App.HotListItem[];
  value: typeof HOT_ITEMS.valueType;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 41, // 👈 对应 rowHeight
    overscan: 8,
  });

  return (
    <div
      ref={parentRef}
      className="overflow-auto overflow-x-hidden"
      style={{ height: '100%' }}
    >
      {/* 👇 关键：撑开滚动高度 */}
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const index = virtualRow.index;

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <RowComponent
                index={index}
                data={data}
                value={value}
                prefix={prefix}
                suffix={suffix}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}