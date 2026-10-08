/**
 * @Description: 豆瓣读书-热门图书（虚构 + 非虚构合并）
 */
import type { HotListItem } from '@/types'

import { fetchJson, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

const BOOK_TYPES = ['fiction', 'nonfiction'] as const

export async function GET(request: Request) {
  // 官方 url：移动端 rexxar 接口，需带站内 Referer
  const refresh = isManualRefresh(request)

  try {
    // 请求数据：两个榜单相互独立，并行拉取
    const responses = await Promise.all(
      BOOK_TYPES.map((type) =>
        fetchJson(`https://m.douban.com/rexxar/api/v2/subject_collection/book_${type}/items?start=0&count=50`, {
          refresh,
          headers: { referer: `https://m.douban.com/book/${type}` },
        }),
      ),
    )

    // 虚构在前、非虚构在后，跨榜去重
    const seen = new Set<string>()
    const result: HotListItem[] = responses
      .flatMap((responseBody) =>
        Array.isArray(responseBody.subject_collection_items) ? responseBody.subject_collection_items : [],
      )
      .filter((v: any) => {
        if (!v?.id || seen.has(v.id)) {
          return false
        }

        seen.add(v.id)

        return true
      })
      .map((v: any) => ({
        id: v.id,
        title: v.title,
        desc: v.info || undefined,
        pic: typeof v.cover === 'string' ? v.cover : v.cover?.url,
        tip: v.rating?.value ? `${v.rating.value}分` : undefined,
        url: `https://book.douban.com/subject/${v.id}/`,
        mobileUrl: `https://m.douban.com/book/subject/${v.id}/`,
      }))

    return successResponse(result)
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
