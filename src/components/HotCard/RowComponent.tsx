/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-12 15:12:53
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:33:53
 * @Description: 动态列表子项
 */
import { Description } from '@heroui/react'
import { useMemo } from 'react'

import OverflowDetector from '@/components/OverflowDetector'
import { formatNumber, hotLableColor, hotTagColor } from '@/lib/utils'

import type { HOT_ITEMS } from '@/enums'
import type { HotListItem } from '@/types'
import type { ReactNode } from 'react'

interface RowData {
  index: number
  data: HotListItem[]
  value: typeof HOT_ITEMS.valueType
  prefix?: ReactNode
  suffix?: ReactNode
}

function HotDisplay({
  value,
  prefix,
  suffix,
}: {
  value: string | number
  prefix?: ReactNode
  suffix?: ReactNode
}) {
  return (
    <Description className="shrink-0 flex items-center gap-0.5">
      {prefix}
      {value}
      {suffix}
    </Description>
  )
}

function RowComponent({ index, data, value, prefix, suffix }: RowData) {
  const item = useMemo(() => data[index], [data, index])
  const { label } = item

  const colorStyle = useMemo(() => {
    const bgColor = label
      ? (hotLableColor[label as keyof typeof hotLableColor] || 'var(--default)')
      : hotTagColor[index] || 'var(--default)'

    const textColor = (label ? hotLableColor[label as keyof typeof hotLableColor] : hotTagColor[index])
      ? 'var(--white)'
      : 'var(--default-foreground)'

    return { backgroundColor: bgColor, color: textColor }
  }, [label, index])

  // Vercel 最佳实践：primitive 派生值无需 useMemo 缓存
  const displayText = label ? label.slice(0, 1) : index + 1

  const endContent = useMemo(() => {
    if (item.hot) {
      return <HotDisplay value={formatNumber(item.hot)} />
    }
    if (item.tip) {
      return <HotDisplay prefix={prefix} suffix={suffix} value={item.tip} />
    }
    return null
  }, [item.hot, item.tip, prefix, suffix])

  return (
    <div className="flex group justify-between items-center gap-1 min-w-0 py-1.5 w-full border-b border-default">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div
          className="text-xs size-6 rounded shrink-0 flex items-center justify-center"
          style={colorStyle}
        >
          {displayText}
        </div>
        <OverflowDetector type={value} record={item} />
      </div>
      {endContent}
    </div>
  )
}

export default RowComponent
