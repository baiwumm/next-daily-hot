/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:38:02
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:36:16
 * @Description: 百度贴吧-热议榜
 */
import { NextResponse } from 'next/server'

import { fetchJson } from '@/lib/request'
import { responseError, responseSuccess } from '@/lib/utils'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://tieba.baidu.com/hottopic/browse/topicList'
  try {
    // 请求数据
    const responseBody = await fetchJson(url)
    // 处理数据
    if (responseBody.errmsg === 'success') {
      const result: HotListItem[] = responseBody.data.bang_topic.topic_list.map((v: any) => {
        return {
          id: v.topic_id.toString(),
          title: v.topic_name,
          desc: v.topic_desc,
          pic: v.topic_pic,
          hot: v.discuss_num,
          url: v.topic_url,
          mobileUrl: v.topic_url,
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
