/**
 * @Description: 少数派-热门文章
 */
import type { HotListItem } from '@/types'

import { fetchJson, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url
  const url = 'https://sspai.com/api/v1/article/hot/page/get?free=1&offset=0&limit=30'

  try {
    // 请求数据
    const responseBody = await fetchJson(url, { refresh: isManualRefresh(request) })

    // 处理数据
    if (responseBody.error === 0 && Array.isArray(responseBody.data)) {
      const result: HotListItem[] = responseBody.data.map((v: any) => {
        return {
          id: v.id,
          title: v.title,
          desc: v.summary,
          pic: v.banner ? `https://cdn.sspai.com/${v.banner}` : undefined,
          hot: v.like_count,
          url: `https://sspai.com/post/${v.id}`,
          mobileUrl: `https://sspai.com/post/${v.id}`,
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
