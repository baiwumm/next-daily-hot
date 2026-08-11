/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:42:24
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:34:48
 * @Description: 腾讯新闻-热点榜
 */
import { fetchJson } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://r.inews.qq.com/gw/event/hot_ranking_list'
  try {
    // 请求数据
    const responseBody = await fetchJson(url)
    // 处理数据
    if (responseBody.ret === 0) {
      const result: HotListItem[] = responseBody.idlist[0].newslist.slice(1).map((v: any) => {
        return {
          id: v.id,
          title: v.title,
          desc: v.abstract,
          pic: v.miniProShareImage,
          hot: v.readCount,
          url: `https://new.qq.com/rain/a/${v.id}`,
          mobileUrl: `https://view.inews.qq.com/a/${v.id}`,
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
