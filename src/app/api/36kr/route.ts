/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-26 14:03:29
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:36:41
 * @Description: 36kr - 24小时热榜
 */
import { fetchJson } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://gateway.36kr.com/api/mis/nav/home/nav/rank/hot'
  try {
    // 请求数据（统一超时，覆盖 Mac UA）
    const responseBody = await fetchJson(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        partner_id: 'wap',
        param: {
          siteId: 1,
          platformId: 2,
        },
        timestamp: Date.now(),
      }),
    })
    // 处理数据
    if (responseBody.code === 0) {
      const result: HotListItem[] = responseBody.data?.hotRankList.map((v: any) => {
        return {
          id: v.itemId,
          title: v?.templateMaterial?.widgetTitle,
          pic: v?.templateMaterial.widgetImage,
          hot: v?.templateMaterial.statRead,
          url: `https://www.36kr.com/p/${v.itemId}`,
          mobileUrl: `https://m.36kr.com/p/${v.itemId}`,
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
