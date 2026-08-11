/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-26 15:16:29
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:38:28
 * @Description: 知乎日报 - 推荐榜
 */
import { fetchJson } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://daily.zhihu.com/api/4/news/latest'
  try {
    // 请求数据（统一 UA + 超时）
    const responseBody = await fetchJson(url, {
      headers: {
        Referer: 'https://daily.zhihu.com/api/4/news/latest',
        Host: 'daily.zhihu.com',
      },
    })
    const data = responseBody?.stories
    if (!data) {
      return successResponse()
    }
    const result: HotListItem[] = data.map((v: any) => {
      return {
        id: v.id,
        title: v.title,
        url: v.url,
        mobileUrl: v.url,
      }
    })
    return successResponse(result)
  }
  catch (error) {
    console.error('上游请求失败：', error)
    return errorResponse()
  }
}
