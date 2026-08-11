/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-26 14:40:35
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:36:48
 * @Description: 虎嗅 - 最新资讯
 */
import { fetchJson } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://moment-api.huxiu.com/web-v3/moment/feed?platform=www'
  try {
    // 请求数据（统一 UA + 超时）
    const responseBody = await fetchJson(url, {
      headers: {
        // 覆盖默认 UA：虎嗅要求极简 UA
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://www.huxiu.com/moment/',
      },
    })
    if (responseBody.success) {
      const result: HotListItem[] = responseBody?.data?.moment_list?.datalist.map((v: any) => {
        const content = (v.content || '').replace(/<br\s*\/?>/gi, '\n')
        const [titleLine, ...rest] = content
          .split('\n')
          .map((s: any) => s.trim())
          .filter(Boolean)
        const title = titleLine?.replace(/。$/, '') || ''
        const intro = rest.join('\n')
        const id = v.object_id
        return {
          id,
          title,
          desc: intro,
          tip: v.format_time,
          url: `https://www.huxiu.com/moment/${id}.html`,
          mobileUrl: `https://m.huxiu.com/moment/${id}.html`,
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
