/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:40:51
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:22:47
 * @Description: 判断是否移动端
 */
import { useState } from 'react'

export function useIsMobile() {
  // Initialize state synchronously if possible, avoiding setState in effect
  const [isMobile] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  })

  return isMobile
}
