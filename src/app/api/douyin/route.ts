/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:14:07
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:34:57
 * @Description: 抖音-热点榜
 */
import { fetchJson } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://aweme.snssdk.com/aweme/v1/hot/search/list/'
  try {
    // 请求数据
    const responseBody = await fetchJson(url)
    // 处理数据
    if (responseBody.status_code === 0) {
      const result: HotListItem[] = responseBody.data.word_list.map((v: any) => {
        return {
          id: v.group_id,
          title: v.word,
          pic: `${v.word_cover.url_list[0]}`,
          hot: Number(v.hot_value),
          url: `https://www.douyin.com/hot/${encodeURIComponent(v.sentence_id)}`,
          mobileUrl: `https://www.douyin.com/hot/${encodeURIComponent(v.sentence_id)}`,
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
