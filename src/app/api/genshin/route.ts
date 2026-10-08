/**
 * @Description: 原神-官方公告（米游社）
 */
import { isManualRefresh } from '@/lib/request'
import { getMiyousheAnnouncements } from '@/lib/miyoushe'
import { errorResponse, successResponse } from '@/lib/response'

export async function GET(request: Request) {
  try {
    // 请求数据
    const result = await getMiyousheAnnouncements(2, 'ys', isManualRefresh(request))

    return successResponse(result)
  } catch (error) {
    console.error('上游请求失败：', error)

    return errorResponse()
  }
}
