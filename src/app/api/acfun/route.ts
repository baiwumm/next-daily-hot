/**
 * @Description: AcFun-热榜
 */
import type { HotListItem } from '@/types'

import { fetchJson, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url
  const url = 'https://www.acfun.cn/rest/pc-direct/rank/channel?channelId=1&subchannelId=1&rankLimit=30&rankPeriod=DAY'

  try {
    // 请求数据
    const responseBody = await fetchJson(url, { refresh: isManualRefresh(request) })

    // 处理数据
    if (responseBody.result === 0 && Array.isArray(responseBody.rankList)) {
      const result: HotListItem[] = responseBody.rankList.map((v: any) => {
        return {
          id: v.contentId,
          title: v.contentTitle,
          pic: v.videoCover,
          hot: v.viewCount,
          tip: v.userName,
          url: `https://www.acfun.cn/v/ac${v.contentId}`,
          mobileUrl: `https://www.acfun.cn/v/ac${v.contentId}`,
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
