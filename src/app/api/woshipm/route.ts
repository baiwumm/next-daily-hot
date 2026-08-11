/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-21 10:07:06
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:38:04
 * @Description: 人人都是产品经理 - 热榜
 */
import { fetchJson } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://www.woshipm.com/api2/app/article/popular/daily'
  try {
    // 请求数据（统一 UA + 超时）
    const responseBody = await fetchJson(url, {
      cache: 'no-store',
    })
    // 处理数据
    if (responseBody.CODE === 200) {
      const result: HotListItem[] = responseBody.RESULT.map((v: any) => {
        const url = `https://www.woshipm.com/${v.data.type}/${v.data.id}.html`
        return {
          id: v.data.id,
          title: v.data.articleTitle,
          desc: v.data.articleSummary,
          hot: v.scores,
          pic: v.data.imageUrl,
          url,
          mobileUrl: url,
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
