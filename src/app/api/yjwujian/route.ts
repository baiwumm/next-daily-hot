/**
 * @Description: 永劫无间-官方资讯（官网新闻页服务端渲染）
 */
import type { HotListItem } from '@/types'

import * as cheerio from 'cheerio'

import { fetchText, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url：新闻列表页为服务端渲染
  const url = 'https://www.yjwujian.cn/news/'

  try {
    // 请求数据
    const responseBody = await fetchText(url, { refresh: isManualRefresh(request) })

    const $ = cheerio.load(responseBody)
    const seen = new Set<string>()
    const result: HotListItem[] = []

    $('a[href*="/news/official/"], a[href*="/news/update/"], a[href*="/news/guide/"]').each((_i, item) => {
      const dom = $(item)
      const href = dom.attr('href') || ''
      // 锚文本为「标题 [MM-DD]」格式，借此过滤导航中的无日期链接
      const match = dom
        .text()
        .replace(/\s+/g, ' ')
        .trim()
        .match(/^(.+?)\s\[(\d{2}-\d{2})\]$/)

      if (!match || seen.has(href)) {
        return
      }

      seen.add(href)

      result.push({
        id: href,
        title: match[1].trim(),
        tip: match[2],
        url: href,
        mobileUrl: href,
      })
    })

    return successResponse(result)
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
