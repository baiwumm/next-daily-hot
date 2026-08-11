/**
 * @description: 请求状态（纯常量，无 JSX 依赖，供服务端 API routes 与客户端共用）
 */

/**
 * 解析缓存窗口（秒）：
 * - 默认 300s（5 分钟）
 * - 支持环境变量 NEXT_PUBLIC_HOT_CACHE_SECONDS 覆盖
 * - 范围限制 60~3600s，非法或越界时回退默认值
 */
function resolveCacheSeconds(): number {
  const DEFAULT_SECONDS = 300
  const MIN_SECONDS = 60
  const MAX_SECONDS = 3600

  const raw = process.env.NEXT_PUBLIC_HOT_CACHE_SECONDS
  if (!raw)
    return DEFAULT_SECONDS

  const value = Number.parseInt(raw, 10)
  if (Number.isNaN(value))
    return DEFAULT_SECONDS

  return Math.min(MAX_SECONDS, Math.max(MIN_SECONDS, value))
}

/**
 * API 响应缓存窗口（秒）：fetch revalidate 与刷新冷却共用
 * 默认 5 分钟，可用 NEXT_PUBLIC_HOT_CACHE_SECONDS 覆盖（范围 60~3600）
 */
export const API_CACHE_SECONDS = resolveCacheSeconds()

const responseConfig = {
  SUCCESS: { value: 200, label: '请求成功' },
  ERROR: { value: 500, label: '请求失败' },
} as const

/** 请求状态码类型 */
export type ResponseValue = (typeof responseConfig)[keyof typeof responseConfig]['value']

export const RESPONSE = {
  SUCCESS: responseConfig.SUCCESS.value,
  ERROR: responseConfig.ERROR.value,
  /** 根据状态码获取文案 */
  label: (value: ResponseValue) =>
    value === responseConfig.SUCCESS.value ? responseConfig.SUCCESS.label : responseConfig.ERROR.label,
}
