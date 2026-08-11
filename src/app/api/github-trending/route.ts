/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-20 15:22:39
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-03 15:03:59
 * @Description: Github - 热门仓库
 */
import * as cheerio from 'cheerio'

import { fetchText } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://github.com'
  try {
    // 请求数据（统一 UA + 超时）
    const responseBody = await fetchText(`${url}/trending`, {
      cache: 'no-store',
    })

    // 格式化 star 数
    function formatStars(count: number): string {
      if (count < 1000)
        return count.toString()

      if (count < 1_000_000) {
        return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`
      }

      return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
    }

    // 得到请求体
    const $ = cheerio.load(responseBody)
    const listDom = $('.Box article.Box-row')
    const result: HotListItem[] = listDom.get().map((repo, index) => {
      const $repo = $(repo)
      const relativeUrl = $repo.find('.h3').find('a').attr('href')
      return {
        id: relativeUrl || String(index),
        title: (relativeUrl || '').replace(/^\//, ''),
        desc: $repo.find('p.my-1').text().trim() || '',
        tip: formatStars(parseInt(
          $repo
            .find('.tmp-mr-3 svg[aria-label=\'star\']')
            .first()
            .parent()
            .text()
            .trim()
            .replace(',', '') || '0',
          10,
        )),
        url: `${url}${relativeUrl}`,
        mobileUrl: `${url}${relativeUrl}`,
      }
    })
    return successResponse(result)
  }
  catch (error) {
    console.error('上游请求失败：', error)
    return errorResponse()
  }
}
