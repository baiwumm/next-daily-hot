'use client'

import { useEffect } from 'react'

import { useAppStore } from '@/store/useAppStore'

export default function AppTimeTicker() {
  useEffect(() => {
    const tick = () => useAppStore.getState().tick()
    const id = setInterval(tick, 60_000) // 1 分钟

    // 后台标签页的 setInterval 会被浏览器节流，设备休眠恢复后 now 可能严重过期，
    // 回到前台时立即校准，保证相对时间与刷新冷却倒计时自洽
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }

    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', tick)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', tick)
    }
  }, [])

  return null
}
