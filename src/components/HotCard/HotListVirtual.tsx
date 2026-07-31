import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

import RowComponent from './RowComponent'

import type { HOT_ITEMS } from '@/enums'
import type { HotListItem } from '@/types'

export default function HotListVirtual({
  data,
  value,
  prefix,
  suffix,
}: {
  data: HotListItem[]
  value: typeof HOT_ITEMS.valueType
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 41, // 👈 对应 rowHeight
    overscan: 8,
  })

  return (
    <div ref={parentRef} className="overflow-auto overflow-x-hidden h-full">
      {/* 👇 关键：撑开滚动高度 */}
      <div className="relative" style={{ height: rowVirtualizer.getTotalSize() }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const index = virtualRow.index
          return (
            <div key={virtualRow.key} className="absolute top-0 left-0 w-full" style={{ transform: `translateY(${virtualRow.start}px)` }}>
              <RowComponent
                data={data}
                index={index}
                prefix={prefix}
                suffix={suffix}
                value={value}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
