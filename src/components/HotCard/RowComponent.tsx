/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-12 15:12:53
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:33:53
 * @Description: 动态列表子项
 */
import type { HotValue } from '@/enums'
import type { HotListItem } from '@/types'
import type { ReactNode } from 'react'

import { Description } from '@heroui/react'
import { memo } from 'react'

import OverflowDetector from '@/components/OverflowDetector'
import { formatNumber, hotLableColor, hotTagColor } from '@/lib/utils'

interface RowData {
  index: number
  data: HotListItem[]
  value: HotValue
  /** 排名趋势：标题 → 名次变化（正数上升 / 负数下降 / 0 持平）；null 表示无对比基准 */
  trends?: Record<string, number> | null
  prefix?: ReactNode
  suffix?: ReactNode
}

function HotDisplay({ value, prefix, suffix }: { value: string | number; prefix?: ReactNode; suffix?: ReactNode }) {
  return (
    <Description className="shrink-0 flex items-center gap-0.5">
      {prefix}
      {value}
      {suffix}
    </Description>
  )
}

// Vercel 最佳实践：虚拟列表行组件用 memo，避免滚动/数据更新时无关行重渲染
const RowComponent = memo(function RowComponent({ index, data, value, trends, prefix, suffix }: RowData) {
  const item = data[index]
  const { label, title } = item

  // 简单的查表取值（primitive / 小对象）无需 useMemo：行组件自身已按 props memo，重渲染频率很低
  const labelColor = label ? hotLableColor[label as keyof typeof hotLableColor] : hotTagColor[index]
  const colorStyle = {
    backgroundColor: labelColor || 'var(--default)',
    color: labelColor ? '#fff' : 'var(--default-foreground)',
  }

  // Vercel 最佳实践：primitive 派生值无需 useMemo 缓存
  const displayText = label ? label.slice(0, 1) : index + 1

  // 排名趋势：无对比基准（首次查看）不显示任何标记；持平不显示；新上榜标「新」
  const titleKey = title.trim()
  const delta = trends?.[titleKey]
  const trendNode =
    trends == null ? null : delta === undefined ? (
      <span className="shrink-0 text-warning text-xs leading-none">新</span>
    ) : delta > 0 ? (
      <span className="shrink-0 text-danger text-xs leading-none">↑{delta}</span>
    ) : delta < 0 ? (
      <span className="shrink-0 text-success text-xs leading-none">↓{-delta}</span>
    ) : null

  // 右侧内容：热度值 / 提示文案 + 趋势标记（行组件已按 props memo，无需再包 useMemo）
  const hotNode = item.hot ? (
    <HotDisplay value={formatNumber(item.hot)} />
  ) : item.tip ? (
    <HotDisplay prefix={prefix} suffix={suffix} value={item.tip} />
  ) : null
  const endContent =
    hotNode || trendNode ? (
      <div className="shrink-0 flex items-center gap-1.5">
        {hotNode}
        {trendNode}
      </div>
    ) : null

  return (
    <div className="flex group justify-between items-center gap-1 min-w-0 py-1.5 w-full border-b border-default">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="text-xs size-6 rounded shrink-0 flex items-center justify-center" style={colorStyle}>
          {displayText}
        </div>
        <OverflowDetector record={item} type={value} />
      </div>
      {endContent}
    </div>
  )
})

export default RowComponent
