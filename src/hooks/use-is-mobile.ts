/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:40:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:22:47
 * @Description: 判断是否移动端
 */
import { useEffect, useState } from 'react'

/** 触屏设备（手机/平板）优先粗指针检测：iPadOS 默认请求桌面 UA，UA 嗅探会漏判 */
const COARSE_POINTER_QUERY = '(pointer: coarse)'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.matchMedia(COARSE_POINTER_QUERY).matches
  })

  // 跟踪指向类型变化（如外接/断开鼠标），避免一次性嗅探导致链接选择过期
  useEffect(() => {
    const query = window.matchMedia(COARSE_POINTER_QUERY)

    const update = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }

    query.addEventListener('change', update)

    return () => query.removeEventListener('change', update)
  }, [])

  return isMobile
}
