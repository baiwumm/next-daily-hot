/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:28:41
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:38:21
 * @Description: 知乎-热榜
 */
import type { HotListItem } from '@/types'

import { fetchJson, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url
  const url = 'https://api.zhihu.com/topstory/hot-list'

  try {
    // 请求数据
    const responseBody = await fetchJson(url, { refresh: isManualRefresh(request) })

    // 处理数据
    if (responseBody.data) {
      const result: HotListItem[] = responseBody.data.map((v: any) => {
        // detail_text 形如 "493万热度"，缺失时不换算，避免整条 hot 变成 NaN
        const hotDigits = v.detail_text?.replace(/\D/g, '')

        return {
          id: v.id,
          title: v.target?.title,
          pic: v.children?.[0]?.thumbnail,
          hot: hotDigits ? Number.parseInt(hotDigits, 10) * 10000 : undefined,
          url: `https://www.zhihu.com/question/${v.card_id?.replace('Q_', '')}`,
          mobileUrl: `https://www.zhihu.com/question/${v.card_id?.replace('Q_', '')}`,
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
