/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-26 15:39:27
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:34:25
 * @Description: 爱范儿 - 快讯
 */
import { fetchJson } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://sso.ifanr.com/api/v5/wp/buzz/?limit=50&offset=0'
  try {
    // 请求数据
    const responseBody = await fetchJson(url)
    const data = responseBody?.objects
    if (!data) {
      return successResponse()
    }
    const result: HotListItem[] = data.map((v: any) => {
      return {
        id: v.post_id,
        title: v.post_title,
        url: v.buzz_original_url || `https://www.ifanr.com/${v.post_id}`,
        mobileUrl: v.buzz_original_url || `https://www.ifanr.com/digest/${v.post_id}`,
      }
    })
    return successResponse(result)
  }
  catch (error) {
    console.error('上游请求失败：', error)
    return errorResponse()
  }
}
