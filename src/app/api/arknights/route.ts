/**
 * @Description: 明日方舟-官方公告
 */
import type { HotListItem } from '@/types'

import { fetchJson, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'
import { formatCnMonthDay } from '@/lib/utils'

/** 官方资讯项（仅保留映射所需字段） */
interface ArknightsNewsItem {
  cid: string
  title: string
  brief?: string
  cover?: string
  displayTime?: number
}

interface ArknightsNewsResponse {
  code: number
  data?: {
    list?: ArknightsNewsItem[]
  }
}

export async function GET(request: Request) {
  // 官方接口每页固定 6 条（共 12 条），两页相互独立，并行拉取
  const pageUrls = [1, 2].map((page) => `https://ak.hypergryph.com/api/news?page=${page}`)

  try {
    const refresh = isManualRefresh(request)
    const responses = await Promise.all(pageUrls.map((url) => fetchJson<ArknightsNewsResponse>(url, { refresh })))

    // 两页独立回源，中间上游若发布新公告会整体位移，按 cid 去重防御
    const seen = new Set<string>()
    const result: HotListItem[] = responses
      .flatMap((responseBody) =>
        responseBody.code === 0 && Array.isArray(responseBody.data?.list) ? responseBody.data.list : [],
      )
      .filter((item) => {
        if (seen.has(item.cid)) {
          return false
        }

        seen.add(item.cid)

        return true
      })
      .map((v) => ({
        id: v.cid,
        title: v.title,
        desc: v.brief || undefined,
        pic: v.cover || undefined,
        tip: formatCnMonthDay(v.displayTime),
        url: `https://ak.hypergryph.com/news/${v.cid}`,
        mobileUrl: `https://ak.hypergryph.com/news/${v.cid}`,
      }))

    return successResponse(result)
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
