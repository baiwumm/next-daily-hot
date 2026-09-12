/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 10:16:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:34:16
 * @Description: 快手-热榜
 */
import type { HotListItem } from '@/types'

import { fetchText, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  // 官方 url
  const url = 'https://www.kuaishou.com/?isHome=1'

  try {
    // 请求数据
    const responseBody = await fetchText(url, { refresh: isManualRefresh(request) })
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
      const info = jsonObject[v.id]
      const id = info?.poster?.match(idPattern)?.[1]

      // 上游偶发缺失条目数据或海报链接，跳过该条，避免一条脏数据打挂整个榜单
      if (!id) return

      // 热度形如 "123.4万"，缺失时不输出 NaN
      result.push({
        id,
        title: info.name,
        hot: info.hotValue ? Number.parseFloat(info.hotValue) * 10000 : undefined,
        url: `https://www.kuaishou.com/short-video/${id}`,
        mobileUrl: `https://www.kuaishou.com/short-video/${id}`,
      })
    })

    return successResponse(result)
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
