/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 10:16:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:34:16
 * @Description: 快手-热榜
 */
import { fetchText } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://www.kuaishou.com/?isHome=1'
  try {
    // 请求数据
    const responseBody = await fetchText(url)
    // 处理数据
    const result: HotListItem[] = []
    const pattern = /window.__APOLLO_STATE__=(.*);\(function\(\)/s
    const idPattern = /clientCacheKey=([A-Za-z0-9]+)/
    const matchResult = responseBody.match(pattern)
    const jsonObject = matchResult ? JSON.parse(matchResult[1]).defaultClient : []

    // 获取所有分类
    const allItems = jsonObject['$ROOT_QUERY.visionHotRank({"page":"home"})'].items
    // 遍历所有分类
    allItems.forEach((v: any) => {
      // 基础数据
      const image = jsonObject[v.id].poster
      const id = image.match(idPattern)[1]
      // 数据处理
      result.push({
        id,
        title: jsonObject[v.id].name,
        hot: jsonObject[v.id].hotValue?.replace('万', '') * 10000,
        url: `https://www.kuaishou.com/short-video/${id}`,
        mobileUrl: `https://www.kuaishou.com/short-video/${id}`,
      })
    })
    return successResponse(result)
  }
  catch (error) {
    console.error('上游请求失败：', error)
    return errorResponse()
  }
}
