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
  const serviceRef = useRef(service)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const requestIdRef = useRef(0)

  // 始终引用最新的 service（避免闭包捕获过期值）
  serviceRef.current = service

  const doRequest = useCallback(async () => {
    const requestId = ++requestIdRef.current
    setLoading(true)
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
        catch (error) {
          lastError = error
        }
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

  return { data, loading, run }
}

export default useRequest
