/**
 * @Description: 新浪新闻-热点榜（接口返回 "var data = {...}" 的 JS 变量赋值，剥离前缀后按 JSON 解析）
 */
import type { HotListItem } from '@/types'

import { fetchText, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url
  const url =
    'https://top.news.sina.com.cn/ws/GetTopDataList.php?top_type=day&top_cat=www_www_all_suda_suda&top_time=today&top_show_num=50'

  try {
    // 请求数据（非纯 JSON，只能走 fetchText）
    const responseBody = await fetchText(url, { refresh: isManualRefresh(request) })

    // 取首尾大括号之间的内容即为 JSON 体（前缀是 "var data = "，结尾带分号）
    const json = JSON.parse(responseBody.slice(responseBody.indexOf('{'), responseBody.lastIndexOf('}') + 1))

    // 处理数据：接口对部分无标题条目会把 title 写成 false（布尔值），直接过滤避免下游 trim 报错
    if (Array.isArray(json?.data)) {
      const result: HotListItem[] = json.data
        .filter((v: any) => typeof v.title === 'string' && v.title.trim())
        .map((v: any) => ({
          id: v.id,
          title: v.title,
          url: v.url,
          mobileUrl: v.url,
          tip: v.create_time,
        }))

      return successResponse(result)
    }

    return successResponse()
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
