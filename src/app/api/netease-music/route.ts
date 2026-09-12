/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 14:13:34
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:37:04
 * @Description: 网易云音乐-新歌榜
 */
import type { HotListItem } from '@/types'

import { fetchJson, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'
import { convertMillisecondsToTime } from '@/lib/utils'

export async function GET(request: Request) {
  // 官方 url
  const url = 'https://music.163.com/api/playlist/detail?id=3778678'

  try {
    // 请求数据（统一 UA + 超时）
    const responseBody = await fetchJson(url, {
      refresh: isManualRefresh(request),
      headers: {
        authority: 'music.163.com',
        referer: 'https://music.163.com/',
      },
    })

    // 处理数据
    if (responseBody.code === 200) {
      const result: HotListItem[] = responseBody.result.tracks.map((v: any) => {
        return {
          id: v.id,
          title: v.name,
          pic: v.album?.picUrl,
          tip: convertMillisecondsToTime(v.duration),
          url: `https://music.163.com/#/song?id=${v.id}`,
          mobileUrl: `https://music.163.com/m/song?id=${v.id}`,
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
