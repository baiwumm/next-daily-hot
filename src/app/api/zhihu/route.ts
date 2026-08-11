/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:28:41
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:38:21
 * @Description: 知乎-热榜
 */
import { NextResponse } from 'next/server'

import { fetchJson } from '@/lib/request'
import { responseError, responseSuccess } from '@/lib/utils'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://api.zhihu.com/topstory/hot-list'
  try {
    // 请求数据
    const responseBody = await fetchJson(url)
    // 处理数据
    if (responseBody.data) {
      const result: HotListItem[] = responseBody.data.map((v: any) => {
        return {
          id: v.id,
          title: v.target.title,
          pic: v.children[0].thumbnail,
          hot: parseInt(v.detail_text.replace(/\D/g, '')) * 10000,
          url: `https://www.zhihu.com/question/${v.card_id.replace('Q_', '')}`,
          mobileUrl: `https://www.zhihu.com/question/${v.card_id.replace('Q_', '')}`,
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
