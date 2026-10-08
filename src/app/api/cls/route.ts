/**
 * @Description: 财联社-热榜
 */
import type { HotListItem } from '@/types'

import crypto from 'node:crypto'

import { fetchJson, isManualRefresh } from '@/lib/request'
import { errorResponse, successResponse } from '@/lib/response'
import { formatCnMonthDay } from '@/lib/utils'

/**
 * 财联社接口固定签名：sign = MD5(SHA1(按参数名排序的 querystring))
 * 参数静态无时间戳，模块级预计算一次复用
 */
const SIGN_QUERY = (() => {
  const params = new URLSearchParams({
    appName: 'CailianpressWeb',
    os: 'web',
    sv: '8.7.9',
  })

  params.sort()

  const sha1 = crypto.createHash('sha1').update(params.toString()).digest('hex')

  params.append('sign', crypto.createHash('md5').update(sha1).digest('hex'))

  return params.toString()
})()

/** 去除快讯正文里夹杂的 HTML 标签 */
const stripTags = (text?: string) => text?.replace(/<[^>]+>/g, '').trim()

export async function GET(request: Request) {
  // 官方 url
  const url = `https://www.cls.cn/v2/article/hot/list?${SIGN_QUERY}`

  try {
    // 请求数据
    const responseBody = await fetchJson(url, { refresh: isManualRefresh(request) })

    // 处理数据
    if (Array.isArray(responseBody.data)) {
      const result: HotListItem[] = responseBody.data.map((v: any) => ({
        id: v.id,
        title: stripTags(v.title || v.brief) || '',
        desc: v.title ? stripTags(v.brief) || undefined : undefined,
        tip: formatCnMonthDay(v.ctime),
        url: `https://www.cls.cn/detail/${v.id}`,
        mobileUrl: `https://www.cls.cn/detail/${v.id}`,
      }))

      return successResponse(result)
    }

    return successResponse()
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
