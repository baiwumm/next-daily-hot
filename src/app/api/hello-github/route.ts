/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-20 15:22:39
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:36:32
 * @Description: HelloGithub - 精选
 */
import { NextResponse } from 'next/server'

import { fetchJson } from '@/lib/request'
import { responseError, responseSuccess } from '@/lib/utils'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://api.hellogithub.com/v1/?sort_by=featured&page=1&rank_by=newest&tid=all'
  try {
    // 请求数据（统一 UA + 超时）
    const responseBody = await fetchJson(url, {
      cache: 'no-store',
    })
    // 处理数据
    if (responseBody.success) {
      const result: HotListItem[] = responseBody.data.map((v: any) => {
        return {
          id: v.item_id,
          title: `${v.name}-${v.title}`,
          desc: v.summary,
          hot: v.clicks_total,
          url: `https://hellogithub.com/repository/${v.full_name}`,
          mobileUrl: `https://hellogithub.com/repository/${v.full_name}`,
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
