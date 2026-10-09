/**
 * @Description: Steam-全球热销榜（store 官方 featuredcategories 公开接口）
 */
import type { HotListItem } from '@/types'

import { fetchJson, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url：cc/l 固定中国区与简中，top_sellers 即热销榜
  const url = 'https://store.steampowered.com/api/featuredcategories/?cc=cn&l=schinese'

  try {
    // 请求数据
    const responseBody = await fetchJson(url, { refresh: isManualRefresh(request) })

    // 处理数据：价格为分为单位，换算为元展示
    const items = responseBody?.top_sellers?.items

    if (Array.isArray(items)) {
      const result: HotListItem[] = items.map((v: any) => ({
        id: v.id,
        title: v.name,
        url: v.url || `https://store.steampowered.com/app/${v.id}/`,
        mobileUrl: v.url || `https://store.steampowered.com/app/${v.id}/`,
        tip: v.final_price ? `¥${Math.round(v.final_price / 100)}` : undefined,
      }))

      return successResponse(result)
    }

    return successResponse()
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
