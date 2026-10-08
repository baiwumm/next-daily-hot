/**
 * @Description: QQ音乐-热歌榜
 */
import type { HotListItem } from '@/types'

import { fetchJson, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'
import { convertMillisecondsToTime } from '@/lib/utils'

export async function GET(request: Request) {
  // 官方 url
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?topid=26&format=json'

  try {
    // 请求数据（携带 Referer 保险，部分场景下 QQ 音乐接口会校验）
    const responseBody = await fetchJson(url, {
      refresh: isManualRefresh(request),
      headers: { referer: 'https://y.qq.com/' },
    })

    // 处理数据
    if (responseBody.code === 0 && Array.isArray(responseBody.songlist)) {
      const result: HotListItem[] = responseBody.songlist.map((v: any) => {
        const singers = (v.data.singer ?? []).map((s: any) => s.name).join('/')

        return {
          id: v.data.songid,
          title: `${v.data.songname} - ${singers}`,
          pic: `https://y.gtimg.cn/music/photo_new/T002R500x500M000${v.data.albummid}.jpg`,
          tip: convertMillisecondsToTime(v.data.interval * 1000),
          url: `https://y.qq.com/n/ryqq/songDetail/${v.data.songmid}`,
          mobileUrl: `https://y.qq.com/n/ryqq/songDetail/${v.data.songmid}`,
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
