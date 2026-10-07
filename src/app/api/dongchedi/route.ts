/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-14 14:02:20
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:35:56
 * @Description: 懂车帝-今日要闻
 */
import type { HotListItem } from '@/types'

import * as cheerio from 'cheerio'

import { fetchText, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url（资讯页与搜索页已改为登录可见，热搜榜无公开数据，改取首页公开展示的「今日要闻」）
  const url = 'https://www.dongchedi.com/'

  try {
    // 请求数据
    const responseBody = await fetchText(url, { refresh: isManualRefresh(request) })
    const $ = cheerio.load(responseBody)
    const json = $('script#__NEXT_DATA__', responseBody).contents().text()
    const data = JSON.parse(json)
    const todayNews = data?.props?.pageProps?.todayNews
    const result: HotListItem[] = [...(todayNews?.head_article ?? []), ...(todayNews?.content_article ?? [])].map(
      (v: any, idx: number) => {
        return {
          id: idx + 1,
          title: v.title,
          url: `https://www.dongchedi.com/article/${v.gid_str}`,
          mobileUrl: `https://www.dongchedi.com/article/${v.gid_str}`,
        }
      },
    )

    return successResponse(result)
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
