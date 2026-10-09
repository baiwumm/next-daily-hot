/**
 * @Description: 什么值得买-热榜（官网 /top/ 页面服务端渲染，HTML 解析）
 */
import type { HotListItem } from '@/types'

import * as cheerio from 'cheerio'

import { fetchText, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url
  const url = 'https://www.smzdm.com/top/'

  try {
    // 请求数据
    const responseBody = await fetchText(url, { refresh: isManualRefresh(request) })

    const $ = cheerio.load(responseBody)
    // 热榜卡片：链接指向 /p/<文章id>/，标题在 .feed-hot-title 内；同文章多入口按 id 去重
    const seen = new Set<string>()
    const result: HotListItem[] = []

    $('a[href*="smzdm.com/p/"]').each((_i, item) => {
      const dom = $(item)
      const id = (dom.attr('href') || '').match(/smzdm\.com\/p\/(\d+)/)?.[1]
      const title = dom.find('.feed-hot-title').text().replace(/\s+/g, ' ').trim()

      if (!id || !title || seen.has(id)) {
        return
      }

      seen.add(id)

      result.push({
        id,
        title,
        url: `https://www.smzdm.com/p/${id}/`,
        mobileUrl: `https://www.smzdm.com/p/${id}/`,
      })
    })

    return successResponse(result)
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
