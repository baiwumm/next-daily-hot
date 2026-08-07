'use client'
import { useEffect, useId, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

interface UseBlurCircleThemeProps {
  duration?: number
  blurAmount?: number
  isDarkMode?: boolean // 由 next-themes 控制
  onDarkModeChange?: (isDark: boolean) => void // 调用 next-themes 的 setTheme
}

// 高分辨率屏幕检测：影响遮罩半径与缩放因子，避免高分屏下动画闪烁/性能问题
function isHighResolution() {
  return typeof window !== 'undefined' && (window.innerWidth >= 3000 || window.innerHeight >= 2000)
}

// 模糊圆 SVG mask 缓存：同一 blur + 分辨率组合只生成一次
const maskCache = new Map<string, string>()

export function useBlurCircleTheme(props: UseBlurCircleThemeProps = {}) {
  const {
    duration: customDuration = 750,
    blurAmount = 2,
    isDarkMode = false,
    onDarkModeChange,
  } = props

  const ref = useRef<HTMLButtonElement>(null)
  const id = useId()
  const animationIdRef = useRef(`blur-circle-${id}`)
  const [isAnimating, setIsAnimating] = useState(false)

  // 注入基础样式
  useEffect(() => {
    const styleId = 'blur-circle-base-style'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
        
        /* 修复高分辨率屏幕的闪烁 */
        ::view-transition-group(root),
        ::view-transition-image-pair(root),
        ::view-transition-old(root),
        ::view-transition-new(root) {
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  const toggleTheme = async () => {
    // 防止重复点击
    if (isAnimating)
      return

    if (
      !ref.current
      || !(document as any).startViewTransition
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      onDarkModeChange?.(!isDarkMode)
      return
    }

    setIsAnimating(true)
    const styleId = animationIdRef.current

    try {
      // 移除旧的样式
      const existingStyle = document.getElementById(styleId)
      if (existingStyle) {
        existingStyle.remove()
      }

      // 获取按钮位置
      const { top, left, width, height } = ref.current.getBoundingClientRect()
      const x = left + width / 2
      const y = top + height / 2

      // 计算遮罩大小
      const viewportSize = Math.max(window.innerWidth, window.innerHeight) + 200
      const highRes = isHighResolution()

      const scaleFactor = highRes ? 2.5 : 4
      const optimalMaskSize = highRes
        ? Math.min(viewportSize * scaleFactor, 5000)
        : viewportSize * scaleFactor

      const topLeft = Math.hypot(x, y)
      const topRight = Math.hypot(window.innerWidth - x, y)
      const bottomLeft = Math.hypot(x, window.innerHeight - y)
      const bottomRight = Math.hypot(window.innerWidth - x, window.innerHeight - y)
      const maxRadius = Math.max(topLeft, topRight, bottomLeft, bottomRight)

      const blurFactor = highRes ? 1.5 : 1.2
      const finalMaskSize = Math.max(optimalMaskSize, maxRadius * 2.5)

      const duration = highRes
        ? Math.max(customDuration * 0.8, 500)
        : customDuration

      // 注入动画样式
      const styleElement = document.createElement('style')
      styleElement.id = styleId
      styleElement.textContent = `
        ::view-transition-group(root) {
          animation-duration: ${duration}ms;
          animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
          will-change: transform;
        }

        ::view-transition-new(root) {
          mask: ${createBlurCircleMask(blurAmount * blurFactor)} 0 0 / 100% 100% no-repeat;
          mask-position: ${x}px ${y}px;
          animation: maskScale ${duration}ms ease-in-out forwards;
          transform-origin: ${x}px ${y}px;
          will-change: mask-size, mask-position;
        }

        ::view-transition-old(root) {
          animation: maskScale ${duration}ms ease-in-out forwards;
          transform-origin: ${x}px ${y}px;
          z-index: -1;
          will-change: mask-size, mask-position;
        }

        @keyframes maskScale {
          0% {
            mask-size: 0px;
            mask-position: ${x}px ${y}px;
          }
          100% {
            mask-size: ${finalMaskSize}px;
            mask-position: ${x - finalMaskSize / 2}px ${y - finalMaskSize / 2}px;
          }
        }
      `
      document.head.appendChild(styleElement)

      // 执行主题切换
      const transition = (document as any).startViewTransition(() => {
        // eslint-disable-next-line react/dom-no-flush-sync
        flushSync(() => {
          onDarkModeChange?.(!isDarkMode)
        })
      })

      // 等待动画真正完成后再清理样式（比 setTimeout 硬编码更精确）
      await transition.finished

      // 平滑清理样式 - 修复闪烁的核心
      const styleEl = document.getElementById(styleId)
      if (styleEl) {
        // 1. 先创建一个保持最终状态的稳定样式
        const stableStyleId = `${styleId}-stable`
        const stableStyle = document.createElement('style')
        stableStyle.id = stableStyleId
        stableStyle.textContent = `
          ::view-transition-new(root) {
            mask: ${createBlurCircleMask(blurAmount * blurFactor)} 0 0 / ${finalMaskSize}px no-repeat !important;
            mask-position: ${x - finalMaskSize / 2}px ${y - finalMaskSize / 2}px !important;
            animation: none !important;
          }
          ::view-transition-old(root) {
            mask: ${createBlurCircleMask(blurAmount * blurFactor)} 0 0 / ${finalMaskSize}px no-repeat !important;
            mask-position: ${x - finalMaskSize / 2}px ${y - finalMaskSize / 2}px !important;
            animation: none !important;
          }
        `
        document.head.appendChild(stableStyle)

        // 2. 使用 requestAnimationFrame 确保稳定样式已应用
        requestAnimationFrame(() => {
          // 移除原始动画样式
          styleEl.remove()

          // 3. 延迟移除稳定样式（添加淡出效果）
          setTimeout(() => {
            const stableEl = document.getElementById(stableStyleId)
            if (stableEl) {
              // 添加淡出过渡
              stableEl.textContent += `
                ::view-transition-new(root) {
                  opacity: 0 !important;
                  transition: opacity 150ms ease !important;
                }
                ::view-transition-old(root) {
                  opacity: 0 !important;
                  transition: opacity 150ms ease !important;
                }
              `

              // 等待淡出完成后移除
              setTimeout(() => {
                stableEl.remove()
              }, 200)
            }
          }, 100)
        })
      }
    }
    catch (error) {
      console.warn('Theme transition failed:', error)
    }
    finally {
      // 无论成功失败都复位动画状态，防止卡死
      setIsAnimating(false)
    }
  }

  return {
    ref,
    toggleTheme,
    isDarkMode,
    isAnimating,
  }
}

// 创建模糊圆遮罩
function createBlurCircleMask(blur: number) {
  const highRes = isHighResolution()
  const cacheKey = `${blur}|${highRes}`

  const cached = maskCache.get(cacheKey)
  if (cached)
    return cached

  const circleRadius = highRes ? 20 : 25
  const blurFilter = `<filter id="blur"><feGaussianBlur stdDeviation="${blur}" /></filter>`
  const mask = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100"><defs>${blurFilter}</defs><circle cx="0" cy="0" r="${circleRadius}" fill="white" filter="url(%23blur)"/></svg>')`

  maskCache.set(cacheKey, mask)
  return mask
}
