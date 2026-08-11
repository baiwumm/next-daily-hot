/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 14:13:34
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:37:04
 * @Description: 网易云音乐-新歌榜
 */
import { NextResponse } from 'next/server'

import { fetchJson } from '@/lib/request'
import { convertMillisecondsToTime, responseError, responseSuccess } from '@/lib/utils'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://music.163.com/api/playlist/detail?id=3778678'
  try {
    // 请求数据（统一 UA + 超时）
    const responseBody = await fetchJson(url, {
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
          author: v.artists.map((item: { name: string }) => item.name).join('/'),
          pic: v.album.picUrl,
          tip: convertMillisecondsToTime(v.duration),
          url: `https://music.163.com/#/song?id=${v.id}`,
          mobileUrl: `https://music.163.com/m/song?id=${v.id}`,
        }
      })
      return NextResponse.json(responseSuccess(result))
    }
    return NextResponse.json(responseSuccess())
  }
  catch (error) {
    console.error('上游请求失败：', error)
    return NextResponse.json(responseError)
  }
}
