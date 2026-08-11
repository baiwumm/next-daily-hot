/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-14 14:02:20
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:35:56
 * @Description: 懂车帝-热搜榜
 */
import * as cheerio from 'cheerio'

import { fetchText } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://www.dongchedi.com/news'
  try {
    // 请求数据
    const responseBody = await fetchText(url)
    const $ = cheerio.load(responseBody)
    const json = $('script#__NEXT_DATA__', responseBody).contents().text()
    const data = JSON.parse(json)
    const result: HotListItem[] = (data?.props?.pageProps?.hotSearchList || []).map((v: any, idx: number) => {
      return {
        id: idx + 1,
        title: v.title,
        hot: v.score,
        url: `https://www.dongchedi.com/search?keyword=${encodeURIComponent(v.title)}`,
        mobileUrl: `https://www.dongchedi.com/search?keyword=${encodeURIComponent(v.title)}`,
      }
    })
    return successResponse(result)
  }
  catch (error) {
    console.error('上游请求失败：', error)
    return errorResponse()
  }
}
