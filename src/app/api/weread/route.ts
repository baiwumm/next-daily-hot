/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 11:27:32
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:37:55
 * @Description: 微信读书-飙升榜
 */
import { NextResponse } from 'next/server'

import { fetchJson } from '@/lib/request'
import { responseError, responseSuccess } from '@/lib/utils'
import { getWereadID } from '@/lib/weread'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://weread.qq.com/web/bookListInCategory/rising?rank=1'
  try {
    // 请求数据
    const responseBody = await fetchJson(url)
    // 处理数据
    if (responseBody.books) {
      const result: HotListItem[] = responseBody.books.map((v: any) => {
        const info = v.bookInfo
        return {
          id: info.bookId,
          title: info.title,
          hot: v.readingCount,
          pic: info.cover.replace('s_', 't9_'),
          url: `https://weread.qq.com/web/bookDetail/${getWereadID(info.bookId)}`,
          mobileUrl: `https://weread.qq.com/web/bookDetail/${getWereadID(info.bookId)}`,
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
