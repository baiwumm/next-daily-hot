import { ArrowDown } from '@gravity-ui/icons'
import { useVirtualizer } from '@tanstack/react-virtual'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import RowComponent from './RowComponent'

import type { HotValue } from '@/enums'
import type { HotListItem } from '@/types'

export default function HotListVirtual({
  data,
  value,
  prefix,
  suffix,
}: {
  data: HotListItem[]
  value: HotValue
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 41, // 👈 初始估算，measureElement 会按实际高度校准
    overscan: 8,
  })

  // 是否还能向下滚动（用于显示"可滚动"提示）
  const [canScrollDown, setCanScrollDown] = useState(false)

  useEffect(() => {
    const el = parentRef.current
    if (!el)
      return

    const update = () => {
      const next = el.scrollHeight - el.scrollTop - el.clientHeight > 8
      setCanScrollDown(prev => (prev === next ? prev : next))
    }

    // rAF 延迟首次测量，避免 effect 中同步 setState
    const frame = requestAnimationFrame(update)
    el.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(el)

    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={parentRef} className="overflow-auto overflow-x-hidden h-full">
        {/* 👇 关键：撑开滚动高度 */}
        <div className="relative" style={{ height: rowVirtualizer.getTotalSize() }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const index = virtualRow.index
            return (
              <div
                key={virtualRow.key}
                ref={rowVirtualizer.measureElement}
                data-index={virtualRow.index}
                className="absolute top-0 left-0 w-full"
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
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

      {/* 可继续向下滚动的提示 */}
      <AnimatePresence>
        {canScrollDown && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            initial={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-2 right-2 pointer-events-none"
          >
            <div className="bg-background/70 backdrop-blur-sm rounded-full p-1 shadow-sm">
              <ArrowDown width={12} className="text-muted" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
