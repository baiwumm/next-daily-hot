/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-14 17:51:27
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:37:21
 * @Description: 夸克-今日热点
 */
import { fetchJson } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://iflow.quark.cn/iflow/api/v1/article/aggregation?aggregation_id=16665090098771297825&count=50&bottom_pos=0'
  try {
    // 请求数据
    const responseBody = await fetchJson(url)
    // 处理数据
    if (responseBody.status === 0) {
      const result: HotListItem[] = responseBody.data.articles.map((v: any) => {
        // publish_time 为毫秒时间戳，取本地时区的 HH:mm
        const publishTime = new Date(v.publish_time)
        const tip = `${String(publishTime.getHours()).padStart(2, '0')}:${String(publishTime.getMinutes()).padStart(2, '0')}`
        return {
          id: v.id,
          title: v.title,
          tip,
          url: `https://123.quark.cn/detail?item_id=${v.id}`,
          mobileUrl: `https://123.quark.cn/detail?item_id=${v.id}`,
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
