/**
 * @Description: 米游社官方公告通用抓取：原神 / 星穹铁道 / 绝区零共用同一族接口，仅分区 ID 与站点路径不同
 */
import type { HotListItem } from '@/types'

import { fetchJson } from '@/lib/request'
import { formatCnMonthDay } from '@/lib/utils'

/** 米游社公告项（仅保留映射所需字段） */
interface MiyoushePost {
  post_id: string
  subject: string
  summary?: string
  cover?: string
  created_at?: number
}

interface MiyousheResponse {
  retcode: number
  data?: {
    list?: Array<{ post: MiyoushePost }>
  }
}

/**
 * 拉取米游社指定游戏的官方公告
 * @param gids 游戏分区 ID：2 原神 / 3 星穹铁道 / 8 绝区零
 * @param site 详情页路径段：ys 原神 / sr 星穹铁道 / zz 绝区零
 * @param refresh 手动刷新时绕过服务端数据缓存
 */
export async function getMiyousheAnnouncements(gids: number, site: string, refresh = false): Promise<HotListItem[]> {
  const url = `https://bbs-api-static.miyoushe.com/painter/wapi/getNewsList?client_type=4&gids=${gids}&last_id=&page_size=20&type=1`
  const responseBody = await fetchJson<MiyousheResponse>(url, { refresh })

  if (responseBody.retcode !== 0 || !Array.isArray(responseBody.data?.list)) {
    return []
  }

  return responseBody.data.list.map(({ post }) => ({
    id: post.post_id,
    title: post.subject,
    desc: post.summary || undefined,
    pic: post.cover || undefined,
    tip: formatCnMonthDay(post.created_at),
    url: `https://www.miyoushe.com/${site}/article/${post.post_id}`,
    mobileUrl: `https://m.miyoushe.com/${site}/#/article/${post.post_id}`,
  }))
}
