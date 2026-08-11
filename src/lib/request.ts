/**
 * @description: 上游请求公共工具：统一 UA、超时与错误日志
 */

/** Chrome 桌面端 UA（多数上游 JSON API 的反爬要求） */
export const UA_CHROME = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'

/** 默认请求超时（ms）：上游挂死时避免请求永久挂起 */
export const REQUEST_TIMEOUT = 15_000

interface RequestInitLike {
  headers?: Record<string, string>
  signal?: AbortSignal
  [key: string]: unknown
}

/**
 * 统一 GET 请求并解析 JSON
 * - 默认携带 Chrome UA（可被 init.headers 覆盖，传空字符串可移除）
 * - 默认 15s 超时（可被 init.signal 覆盖）
 * - 非 2xx 直接抛错（错误信息含状态码与 URL）
 */
export async function fetchJson<T = any>(url: string, init: RequestInitLike = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    signal: init.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT),
    headers: buildHeaders(init.headers),
  })
  if (!response.ok) {
    throw new Error(`上游请求失败：${response.status} ${url}`)
  }
  return response.json() as Promise<T>
}

/**
 * 统一 GET 请求并返回文本（用于 cheerio / 正则解析的 HTML 页面）
 */
export async function fetchText(url: string, init: RequestInitLike = {}): Promise<string> {
  const response = await fetch(url, {
    ...init,
    signal: init.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT),
    headers: buildHeaders(init.headers),
  })
  if (!response.ok) {
    throw new Error(`上游请求失败：${response.status} ${url}`)
  }
  return response.text()
}

/**
 * 组装请求头：
 * - 未显式设置 User-Agent 时注入默认 Chrome UA
 * - 显式传 'User-Agent': '' 表示不发送 UA 头（个别上游对桌面 UA 返回反爬页）
 */
function buildHeaders(initHeaders?: Record<string, string>) {
  const headers = new Headers()
  let hasExplicitUA = false

  for (const [key, value] of Object.entries(initHeaders ?? {})) {
    if (key.toLowerCase() === 'user-agent') {
      hasExplicitUA = true
      if (value)
        headers.set(key, value)
    }
    else {
      headers.set(key, value)
    }
  }

  if (!hasExplicitUA) {
    headers.set('User-Agent', UA_CHROME)
  }

  return headers
}
