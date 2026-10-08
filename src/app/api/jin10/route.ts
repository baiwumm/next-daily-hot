/**
 * @Description: 金十数据-快讯
 */
import type { HotListItem } from '@/types'

import { fetchText, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url
  const url = 'https://www.jin10.com/flash_newest.js'

  try {
    // 请求数据（上游返回 JS 文件 `var newest = [...];`，剥离后解析）
    const responseText = await fetchText(url, { refresh: isManualRefresh(request) })
    const list = JSON.parse(responseText.replace(/^var newest = /, '').replace(/;\s*$/, ''))

    // 处理数据：过滤无文本的空条目（图表等特殊快讯）
    if (Array.isArray(list)) {
      const result: HotListItem[] = list
        .filter((v: any) => v.id && (v.data?.title || v.data?.content))
        .map((v: any) => {
          // 个别条目文本混入 HTML 标签，统一剥离
          const strip = (text: string) => text.replace(/<[^>]+>/g, '')
          const title = strip(String(v.data.title ?? '')) || strip(String(v.data.content ?? ''))
          const content = strip(String(v.data.content ?? ''))

          return {
            id: v.id,
            title,
            desc: v.data.title ? content : undefined,
            pic: v.data.pic || undefined,
            tip: String(v.time ?? '').slice(11, 16),
            label: v.important === 1 ? '重要' : undefined,
            url: `https://flash.jin10.com/detail/${v.id}`,
            mobileUrl: `https://flash.jin10.com/detail/${v.id}`,
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
