/**
 * @Description: 东方财富-7x24 快讯
 */
import type { HotListItem } from '@/types'

import { API_CACHE_SECONDS } from '@/config/response'
import { fetchJson, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url：req_trace 为必填的请求追踪参数，按缓存窗口取整保证 Data Cache 的 URL 键稳定
  const reqTrace = Math.floor(Date.now() / (API_CACHE_SECONDS * 1000))
  const url = `https://np-listapi.eastmoney.com/comm/web/getFastNewsList?client=web&biz=web_724&fastColumn=102&sortEnd=&pageSize=50&req_trace=${reqTrace}`

  try {
    // 请求数据
    const responseBody = await fetchJson(url, { refresh: isManualRefresh(request) })

    // 处理数据
    if (responseBody.code === '1' && Array.isArray(responseBody.data?.fastNewsList)) {
      const result: HotListItem[] = responseBody.data.fastNewsList.map((v: any) => ({
        id: v.code,
        title: (v.title || v.summary || '').replace(/<[^>]+>/g, '').trim(),
        tip: typeof v.showTime === 'string' ? v.showTime.slice(11, 16) : undefined,
        url: `https://finance.eastmoney.com/a/${v.code}.html`,
        mobileUrl: `https://finance.eastmoney.com/a/${v.code}.html`,
      }))

      return successResponse(result)
    }

    return successResponse()
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
