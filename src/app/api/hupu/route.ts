/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-14 16:54:38
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:36:56
 * @Description: 虎扑-步行街热帖
 */
import * as cheerio from 'cheerio'

import { fetchText } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://bbs.hupu.com/all-gambia'
  try {
    // 请求数据（虎扑对桌面 UA 返回反爬页，保持无 UA 请求）
    const responseBody = await fetchText(url, {
      headers: { 'User-Agent': '' },
    })
    const $ = cheerio.load(responseBody)
    const json = $('script').first()
    const data = JSON.parse(json.text().split('window.$$data=')[1])
      .pageData
      .threads
    const result: HotListItem[] = data.map((v: any) => {
      return {
        id: v.tid,
        title: v.title,
        desc: v.desc,
        pic: v.cover,
        tip: v.lights,
        url: `https://bbs.hupu.com${v.url}`,
        mobileUrl: `https://bbs.hupu.com${v.url}`,
      }
    })
    return successResponse(result)
  }
  catch (error) {
    console.error('上游请求失败：', error)
    return errorResponse()
  }
}
