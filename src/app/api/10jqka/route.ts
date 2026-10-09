/**
 * @Description: 同花顺-热榜（快讯流，按时间倒序即榜单序）
 */
import type { HotListItem } from '@/types'

import { fetchJson, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'
import { formatCnMonthDay } from '@/lib/utils'

export async function GET(request: Request) {
  // 官方 url
  const url = 'https://news.10jqka.com.cn/tapp/news/push/stock/?page=1&pagesize=50'

  try {
    // 请求数据
    const responseBody = await fetchJson(url, { refresh: isManualRefresh(request) })

    // 处理数据
    if (Array.isArray(responseBody?.data?.list)) {
      const result: HotListItem[] = responseBody.data.list.map((v: any) => ({
        id: v.id,
        title: v.title,
        desc: v.digest || undefined,
        url: v.url,
        mobileUrl: v.appUrl || v.url,
        tip: formatCnMonthDay(v.ctime),
      }))

      return successResponse(result)
    }

    return successResponse()
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
