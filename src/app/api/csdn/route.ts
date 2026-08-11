/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-21 09:20:44
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:35:33
 * @Description: CSDN - 热榜
 */
import { fetchJson } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://blog.csdn.net/phoenix/web/blog/hot-rank?page=0&pageSize=100'
  try {
    // 请求数据（统一 UA + 超时）
    const responseBody = await fetchJson(url, {
      cache: 'no-store',
    })
    // 处理数据
    if (responseBody.code === 200) {
      const result: HotListItem[] = responseBody.data.map((v: any) => {
        return {
          id: v.articleDetailUrl,
          title: v.articleTitle,
          tip: v.pcHotRankScore,
          url: v.articleDetailUrl,
          mobileUrl: v.articleDetailUrl,
        }
      })
      return successResponse(result)
    }
    return successResponse()
  }
  catch (error) {
    console.error('上游请求失败：', error)
    return errorResponse()
  }
}
