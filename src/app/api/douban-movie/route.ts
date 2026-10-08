/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 14:02:04
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:35:06
 * @Description: 豆瓣电影-新片榜
 */
import type { HotListItem } from '@/types'

import * as cheerio from 'cheerio'

import { fetchText, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url
  const url = 'https://movie.douban.com/chart/'

  try {
    // 请求数据
    const responseBody = await fetchText(url, { refresh: isManualRefresh(request) })
    // 处理数据
    const getNumbers = (text: string | undefined) => {
      if (!text) return 10000000
      const regex = /\d+/
      const match = text.match(regex)

      if (match) {
        return Number(match[0])
      } else {
        return 10000000
      }
    }
    const $ = cheerio.load(responseBody)
    const listDom = $('.article tr.item')
    const result: HotListItem[] = listDom.toArray().map((item) => {
      const dom = $(item)
      const url = dom.find('a').attr('href') || ''

      return {
        id: String(getNumbers(url)),
        title: `${dom.find('.pl2 a').text().replace(/\s+/g, ' ').trim().replace(/\n/g, '')}`,
        desc: dom.find('p.pl').text(),
        hot: getNumbers(dom.find('span.pl').text()),
        url,
        mobileUrl: `https://m.douban.com/movie/subject/${getNumbers(url)}/`,
      }
    })

    return successResponse(result)
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
