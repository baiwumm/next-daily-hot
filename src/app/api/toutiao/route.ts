/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:19:59
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:37:37
 * @Description: 今日头条-热榜
 */
import { fetchJson } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc'
  try {
    // 请求数据
    const responseBody = await fetchJson(url)
    // 处理数据
    if (responseBody.status === 'success') {
      const result: HotListItem[] = responseBody.data.map((v: any) => {
        return {
          id: v.ClusterId,
          title: v.Title,
          pic: v.Image.url,
          hot: v.HotValue,
          url: `https://www.toutiao.com/trending/${v.ClusterIdStr}/`,
          mobileUrl: `https://api.toutiaoapi.com/feoffline/amos_land/new/html/main/index.html?topic_id=${v.ClusterIdStr}`,
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
