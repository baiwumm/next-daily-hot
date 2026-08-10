/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:36:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:33:46
 * @Description: 判断文本是否溢出
 */
'use client'

import { Tooltip } from '@heroui/react'
import { track } from '@vercel/analytics'
import { memo, useEffect, useRef, useState } from 'react'

import { useIsMobile } from '@/hooks/use-is-mobile'

import type { HOT_ITEMS } from '@/enums'
import type { HotListItem } from '@/types'

interface OverflowDetectorProps {
  record: HotListItem
  type: typeof HOT_ITEMS.valueType
}

const OverflowDetector = memo(({
  record,
  type,
}: OverflowDetectorProps) => {
  const ref = useRef<HTMLAnchorElement>(null)

  // 判断是否是移动端
  const isMobile = useIsMobile()

  // 内容是否溢出
  const [isOverflowing, setIsOverflowing] = useState(false)

  // 点击标题上报
  const handleTitle = () => {
    track(type)
  }

  // 只在组件挂载时检测一次 overflow
  useEffect(() => {
    const el = ref.current
    if (!el)
      return

    const checkOverflow = () => {
      setIsOverflowing(el.scrollWidth > el.clientWidth)
    }

    // 等 DOM 渲染完成
    requestAnimationFrame(checkOverflow)
  }, [])

  return (
    <Tooltip isDisabled={!isOverflowing} delay={0}>
      <Tooltip.Trigger aria-label={record.title} className="min-w-0 flex-1">
        <a
          ref={ref}
          href={isMobile ? record.mobileUrl : record.url}
          rel="noopener noreferrer"
          target="_blank"
          onClick={handleTitle}
          className="truncate block transition-transform ease-in duration-300 text-sm relative py-1 after:absolute after:content-[''] after:h-0.5 after:w-0 after:left-0 after:bottom-0 after:bg-border after:transition-[width] after:duration-500 hover:translate-x-1 hover:after:w-full"
        >
          {record.title}
        </a>
      </Tooltip.Trigger>

      <Tooltip.Content placement="top">
        <Tooltip.Arrow />
        <p>{record.title}</p>
      </Tooltip.Content>
    </Tooltip>
  )
})

export default OverflowDetector
