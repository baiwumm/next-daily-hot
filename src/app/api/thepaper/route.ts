/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 10:12:17
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:37:29
 * @Description: 澎湃新闻-热榜
 */
import type { HotListItem } from '@/types'

import { fetchJson, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url
  const url = 'https://cache.thepaper.cn/contentapi/wwwIndex/rightSidebar'

  try {
    // 请求数据
    const responseBody = await fetchJson(url, { refresh: isManualRefresh(request) })

    // 处理数据
    if (responseBody.resultCode === 1) {
      const result: HotListItem[] = responseBody.data.hotNews.map((v: any) => {
        return {
          id: v.contId,
          title: v.name,
          pic: v.pic,
          hot: v.praiseTimes,
          url: `https://www.thepaper.cn/newsDetail_forward_${v.contId}`,
          mobileUrl: `https://m.thepaper.cn/newsDetail_forward_${v.contId}`,
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
