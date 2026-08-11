/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 10:12:17
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:37:29
 * @Description: 澎湃新闻-热榜
 */
import { NextResponse } from 'next/server'

import { fetchJson } from '@/lib/request'
import { responseError, responseSuccess } from '@/lib/utils'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://cache.thepaper.cn/contentapi/wwwIndex/rightSidebar'
  try {
    // 请求数据
    const responseBody = await fetchJson(url)
    // 处理数据
    if (responseBody.resultCode === 1) {
      const result: HotListItem[] = responseBody.data.hotNews.map((v: any) => {
        return {
          id: v.contId,
          title: v.name,
          pic: v.pic,
          hot: v.praiseTimes,
          url: `https://www.thepaper.cn/newsDetail_forward_${v.contId}`,
          mobileUrl: `https://m.thepaper.cn/newsDetail_forward_${v.contId}`,
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
