/**
 * @Description: 华尔街见闻-热文榜
 */
import type { HotListItem } from '@/types'

import { fetchJson, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url
  const url = 'https://api-one.wallstcn.com/apiv1/content/articles/hot?period=all'

  try {
    // 请求数据
    const responseBody = await fetchJson(url, { refresh: isManualRefresh(request) })

    // 处理数据
    if (responseBody.code === 20000 && Array.isArray(responseBody.data?.day_items)) {
      const result: HotListItem[] = responseBody.data.day_items.map((v: any) => {
        return {
          id: v.id,
          title: v.title,
          hot: v.pageviews,
          url: v.uri || `https://wallstreetcn.com/articles/${v.id}`,
          mobileUrl: v.uri || `https://wallstreetcn.com/articles/${v.id}`,
        }
      })

      return successResponse(result)
    }

    return successResponse()
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
