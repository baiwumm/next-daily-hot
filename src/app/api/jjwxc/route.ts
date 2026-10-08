/**
 * @Description: 晋江文学城-总分排行榜（官网 HTML 解析，gb18030 编码）
 */
import type { HotListItem } from '@/types'

import * as cheerio from 'cheerio'

import { fetchText, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url：topten 榜单为服务端渲染
  const url = 'https://www.jjwxc.net/topten.php?orderstr=7'

  try {
    // 请求数据
    const responseBody = await fetchText(url, {
      refresh: isManualRefresh(request),
      encoding: 'gb18030',
    })

    const $ = cheerio.load(responseBody)
    // 同一作品会以标题、封面等多个链接出现，按作品 ID 去重
    const seen = new Set<string>()
    const result: HotListItem[] = []

    $('a[href*="onebook.php"]').each((_i, item) => {
      const dom = $(item)
      const novelid = (dom.attr('href') || '').match(/novelid=(\d+)/)?.[1]
      const title = dom.text().replace(/\s+/g, ' ').trim()

      if (!novelid || !title || seen.has(novelid)) {
        return
      }

      seen.add(novelid)

      result.push({
        id: novelid,
        title,
        url: `https://www.jjwxc.net/onebook.php?novelid=${novelid}`,
        mobileUrl: `https://www.jjwxc.net/onebook.php?novelid=${novelid}`,
      })
    })

    return successResponse(result)
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
