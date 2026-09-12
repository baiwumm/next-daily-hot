/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 10:25:47
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:36:08
 * @Description: 百度百科-历史上的今天
 */
import type { HotListItem } from '@/types'

import { fetchJson, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

/** 按东八区取当前月/日：服务端运行在 UTC，直接 new Date() 在北京时间 0~8 点会拿到昨天 */
function getBeijingMonthDay(): { month: string; day: string } {
  // en-CA 的日期格式固定为 YYYY-MM-DD，便于直接拆分
  const [, month, day] = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(new Date())
    .split('-')

  return { month, day }
}

export async function GET(request: Request) {
  const { month, day } = getBeijingMonthDay()
  const url = `https://baike.baidu.com/cms/home/eventsOnHistory/${month}.json`

  try {
    // 请求数据
    const responseBody = await fetchJson(url, { refresh: isManualRefresh(request) })
    // 处理数据
    const result: HotListItem[] = responseBody[month][month + day].map((v: any, index: number) => {
      return {
        id: index,
        title: v.title.replace(/<[^>]+>/g, ''),
        tip: v.year,
        url: v.link,
        mobileUrl: v.link,
      }
    })

    return successResponse(result)
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
