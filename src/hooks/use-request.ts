/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-08-07 17:43:06
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-08-07 17:43:06
 * @Description: useRequest 请求 hook，等价替换 ahooks useRequest（manual / debounceWait / retryCount）
 */
import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseRequestOptions {
  /** 是否手动触发（true 时不自动请求，仅通过 run() 触发） */
  manual?: boolean
  /** run 调用防抖毫秒数，重试不受防抖影响 */
  debounceWait?: number
  /** 请求失败后自动重试次数（总尝试次数 = retryCount + 1） */
  retryCount?: number
}

/**
 * 请求 hook，行为对齐 ahooks useRequest：
 * - manual: true 时不自动请求，仅通过 run() 触发
 * - debounceWait: 对 run() 调用做防抖
 * - retryCount: 请求失败后自动重试次数
 */
export function useRequest<TData>(
  service: () => Promise<TData>,
  options: UseRequestOptions = {},
) {
  const { manual = false, debounceWait = 0, retryCount = 0 } = options
  const [data, setData] = useState<TData>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(undefined)
  const serviceRef = useRef(service)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const requestIdRef = useRef(0)

  // 始终引用最新的 service（避免闭包捕获过期值）
  serviceRef.current = service

  const doRequest = useCallback(async () => {
    const requestId = ++requestIdRef.current
    setLoading(true)
    // 新请求开始时清除上一次的错误状态
    setError(undefined)
    try {
      let lastError: unknown
      // 失败后自动重试 retryCount 次（总尝试次数 = retryCount + 1）
      for (let attempt = 0; attempt <= retryCount; attempt++) {
        try {
          const result = await serviceRef.current()
          // 只认最后一次请求的结果（防止旧请求覆盖新结果）
          if (requestId === requestIdRef.current) {
            setData(result)
          }
          return result
        }
        catch (catchError) {
          lastError = catchError
          // 指数退避：500ms → 1s → 2s，避免连续快速重试加重源站负担
          if (attempt < retryCount) {
            await new Promise(resolve => setTimeout(resolve, 500 * 2 ** attempt))
          }
        }
      }
      // 全部重试失败后记录错误
      if (requestId === requestIdRef.current) {
        setError(lastError)
      }
      throw lastError
    }
    finally {
      if (requestId === requestIdRef.current) {
        setLoading(false)
      }
    }
  }, [retryCount])

  const run = useCallback(
    (..._args: unknown[]) => {
      const request = () => {
        // 吞掉错误，避免 unhandled rejection（ahooks 的 run 同样静默吞错）
        void doRequest().catch(() => {})
      }
      if (debounceWait > 0) {
        // 防抖等待期间立即给出 loading 反馈，避免点击后"无响应"的错觉。
        // run 同时被事件处理器与自动请求的 effect 调用，此处为有意设计，
        // 自动模式下该 setState 冗余（初始 loading 状态一致），React 会直接 bail out，故豁免规则。
        // eslint-disable-next-line react/set-state-in-effect
        setLoading(true)
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(request, debounceWait)
        return
      }
      request()
    },
    [debounceWait, doRequest],
  )

  // 组件卸载时清理防抖定时器
  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  // manual: true 时不自动请求
  useEffect(() => {
    if (manual) {
      return
    }
    run()
  }, [manual, run])

  return { data, loading, error, run }
}

export default useRequest
