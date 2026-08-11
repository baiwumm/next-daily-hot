/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:50:55
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:35:25
 * @Description: 网易新闻-热榜
 */
import { NextResponse } from 'next/server'

import { fetchJson } from '@/lib/request'
import { responseError, responseSuccess } from '@/lib/utils'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://m.163.com/fe/api/hot/news/flow'
  try {
    // 请求数据
    const responseBody = await fetchJson(url)
    // 处理数据
    if (responseBody.msg === 'success') {
      const result: HotListItem[] = responseBody.data.list.map((v: any) => {
        return {
          id: v.skipID,
          title: v.title,
          desc: v._keyword,
          pic: v.imgsrc,
          url: `https://www.163.com/dy/article/${v.skipID}.html`,
          mobileUrl: v.url,
        }
      })
      return NextResponse.json(responseSuccess(result))
    }
    return NextResponse.json(responseSuccess())
  }
  catch (error) {
    console.error('上游请求失败：', error)
    return NextResponse.json(responseError)
  }
}
