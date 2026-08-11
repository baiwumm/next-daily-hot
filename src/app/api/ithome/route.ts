/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-26 15:47:22
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:34:34
 * @Description: IT之家- 热榜
 */
import * as cheerio from 'cheerio'

import { fetchText } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://m.ithome.com/rankm'
  try {
    // 请求数据
    const responseBody = await fetchText(url)
    // 链接处理
    const replaceLink = (url: string, getId: boolean = false) => {
      const match = url.match(/[html|ive]\/(\d+)\.htm/)
      // 是否匹配成功
      if (match && match[1]) {
        return getId
          ? match[1]
          : `https://www.ithome.com/0/${match[1].slice(0, 3)}/${match[1].slice(3)}.htm`
      }
      // 返回原始 URL
      return url
    }
    const $ = cheerio.load(responseBody)
    const listDom = $('.rank-box .placeholder')
    const result: HotListItem[] = listDom.toArray().map((item, index) => {
      const dom = $(item)
      const href = dom.find('a').attr('href')
      return {
        id: index,
        title: dom.find('.plc-title').text().trim(),
        pic: dom.find('img').attr('data-original'),
        hot: Number(dom.find('.review-num').text().replace(/\D/g, '')),
        url: href ? replaceLink(href) : '',
        mobileUrl: href ? replaceLink(href) : '',
      }
    })
    return successResponse(result)
  }
  catch (error) {
    console.error('上游请求失败：', error)
    return errorResponse()
  }
}
