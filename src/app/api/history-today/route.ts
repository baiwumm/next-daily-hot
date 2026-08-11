/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 10:25:47
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:36:08
 * @Description: 百度百科-历史上的今天
 */
import { NextResponse } from 'next/server'

import { fetchJson } from '@/lib/request'
import { responseError, responseSuccess } from '@/lib/utils'

import type { HotListItem } from '@/types'

export async function GET() {
  // 获取月份
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0')
  // 获取天数
  const day = new Date().getDate().toString().padStart(2, '0')
  const url = `https://baike.baidu.com/cms/home/eventsOnHistory/${month}.json`
  try {
    // 请求数据
    const responseBody = await fetchJson(url)
    // 处理数据
    const result: HotListItem[] = responseBody[month][month + day].map((v: any, index: number) => {
      return {
        id: index,
        title: v.title.replace(/<[^>]+>/g, ''),
        tip: v.year,
        type: v.type,
        url: v.link,
        mobileUrl: v.link,
      }
    })
    return NextResponse.json(responseSuccess(result))
  }
  catch (error) {
    console.error('上游请求失败：', error)
    return NextResponse.json(responseError)
  }
}
