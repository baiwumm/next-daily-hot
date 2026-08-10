/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-05 09:13:12
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:29:46
 * @Description: 日期时间
 */
import { Description } from '@heroui/react'
import NumberFlow, { NumberFlowGroup } from '@number-flow/react'
import { memo, useEffect, useState } from 'react'

import type { FC } from 'react'

const TimeAndLunar: FC = memo(() => {
  const [now, setNow] = useState(() => new Date())
  const [lunar, setLunar] = useState('')

  useEffect(() => {
    let lastDate = ''
    let lastSecond = ''
    let cancelled = false

    const update = () => {
      const current = new Date()

      // 仅当秒数变化时才更新，避免 60fps 重渲染
      const secondKey = `${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`
      if (secondKey !== lastSecond) {
        lastSecond = secondKey
        setNow(current)
      }

      const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
      if (dateStr !== lastDate) {
        lastDate = dateStr

        // Vercel 最佳实践：lunar-typescript 按需加载，不进入首屏 bundle
        void import('lunar-typescript').then(({ Lunar }) => {
          if (cancelled)
            return

          const l = Lunar.fromDate(current)
          setLunar(
            `${l.getYearInGanZhi()}年 ${l.getMonthInGanZhi()}月 ${l.getDayInGanZhi()}日 ${l.getMonthInChinese()}月${l.getDayInChinese()} 星期${l.getWeekInChinese()}`,
          )
        })
      }
    }

    // 首次由 rAF 异步触发（避免 effect 中同步 setState），之后每秒刷新
    const frame = requestAnimationFrame(update)
    const timer = setInterval(update, 1000)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      clearInterval(timer)
    }
  }, [])

  const d = now

  return (
    <div className="justify-self-center hidden sm:flex flex-col gap-1 text-center">
      {/* 数字流时间 */}
      <NumberFlowGroup>
        <div className="flex items-center justify-center text-sm">
          <NumberFlow format={{ useGrouping: false }} value={d.getFullYear()} />
          <NumberFlow format={{ minimumIntegerDigits: 2 }} prefix="-" value={d.getMonth() + 1} />
          <NumberFlow format={{ minimumIntegerDigits: 2 }} prefix="-" value={d.getDate()} />
          <span className="mx-1"> </span>
          <NumberFlow format={{ minimumIntegerDigits: 2 }} value={d.getHours()} />
          <NumberFlow format={{ minimumIntegerDigits: 2 }} prefix=":" value={d.getMinutes()} />
          <NumberFlow format={{ minimumIntegerDigits: 2 }} prefix=":" value={d.getSeconds()} />
        </div>
      </NumberFlowGroup>
      {/* 农历 */}
      <Description>{lunar || '加载农历中...'}</Description>
    </div>
  )
})

export default TimeAndLunar
