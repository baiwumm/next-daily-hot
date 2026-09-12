/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-13 16:25:11
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:35:44
 * @Description: 哔哩哔哩-热门榜
 */
import type { HotListItem } from '@/types'

import { fetchJson, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url
  const url = 'https://api.bilibili.com/x/web-interface/ranking/v2'

  try {
    // 请求数据（统一 UA + 超时）
    const responseBody = await fetchJson(url, {
      refresh: isManualRefresh(request),
      headers: {
        Referer: `https://www.bilibili.com/ranking/all`,
      },
    })
    const data = responseBody?.data?.realtime || responseBody?.data?.list

    if (!data) {
      return successResponse()
    }
    const result: HotListItem[] = data.map((v: any) => {
      return {
        id: v.bvid,
        title: v.title,
        desc: v.desc,
        pic: v.pic?.replace(/http:/, 'https:'),
        hot: v.stat?.view,
        url: v.short_link_v2 || `https://b23.tv/${v.bvid}`,
        mobileUrl: `https://m.bilibili.com/video/${v.bvid}`,
      }
    })

    return successResponse(result)
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
