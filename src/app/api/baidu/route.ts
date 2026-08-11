/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:33:19
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:36:23
 * @Description: 百度-热搜榜
 */
import { fetchJson } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://top.baidu.com/api/board?platform=wise&tab=realtime'
  try {
    // 请求数据
    const responseBody = await fetchJson(url)
    // 处理数据
    if (responseBody.success) {
      const result: HotListItem[] = responseBody.data.cards[0]?.content[0]?.content.map((v: any) => {
        return {
          id: v.index,
          title: v.word,
          label: v.newHotName,
          url: `https://www.baidu.com/s?wd=${encodeURIComponent(v.word)}`,
          mobileUrl: v.url,
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
