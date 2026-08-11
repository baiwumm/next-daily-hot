/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:54:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:34:41
 * @Description: 英雄联盟-更新公告
 */
import { fetchJson } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'

import type { HotListItem } from '@/types'

export async function GET() {
  // 官方 url
  const url = 'https://apps.game.qq.com/cmc/zmMcnTargetContentList?page=1&num=50&target=24&source=web_pc'
  try {
    // 请求数据
    const responseBody = await fetchJson(url)
    // 处理数据
    if (responseBody.status === 1) {
      const result: HotListItem[] = responseBody.data.result.map((v: any) => {
        return {
          id: v.iDocID,
          title: v.sTitle,
          desc: v.sAuthor,
          pic: v.sIMG,
          hot: Number(v.iTotalPlay),
          url: `https://lol.qq.com/news/detail.shtml?docid=${encodeURIComponent(v.iDocID)}`,
          mobileUrl: `https://lol.qq.com/news/detail.shtml?docid=${encodeURIComponent(v.iDocID)}`,
        }
      })
      return successResponse(result)
    }
    return successResponse()
  }
  catch (error) {
    console.error('上游请求失败：', error)
    return errorResponse()
  }
}
