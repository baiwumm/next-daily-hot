/**
 * @Description: 和平精英-官方资讯（官网首页服务端渲染，GBK 编码）
 */
import type { HotListItem } from '@/types'

import * as cheerio from 'cheerio'

import { fetchText, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url：官网新闻区为服务端渲染，含 featured 与列表两种条目样式
  const url = 'https://gp.qq.com/main.shtml'

  try {
    // 请求数据
    const responseBody = await fetchText(url, {
      refresh: isManualRefresh(request),
      encoding: 'gbk',
    })

    const $ = cheerio.load(responseBody)
    // 页面同一新闻会在多个 tab 区块重复渲染，按文章 ID 去重
    const seen = new Set<string>()
    const result: HotListItem[] = []

    $('a[href*="/gicp/news/"]').each((_i, item) => {
      const dom = $(item)
      const href = dom.attr('href') || ''
      const id = href.match(/\/(\d+)\.html/)?.[1]
      const title = (
        dom.find('.sec2-sub-text').text() ||
        dom.find('.sec2-info-body-text').text() ||
        dom.attr('title') ||
        ''
      )
        .replace(/\s+/g, ' ')
        .trim()

      if (!id || !title || seen.has(id)) {
        return
      }

      seen.add(id)

      const date = dom.find('.sec2-info-time-text').text().trim()
      const articleUrl = new URL(href, 'https://gp.qq.com/').toString()

      result.push({
        id,
        title,
        tip: date || undefined,
        url: articleUrl,
        mobileUrl: articleUrl,
      })
    })

    return successResponse(result)
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
