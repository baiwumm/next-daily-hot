import { NextResponse } from 'next/server'

import { RESPONSE } from '@/enums/response'

import type { HotListItem, IResponse } from '@/types'

/** 成功响应缓存头：CDN 边缘缓存 5 分钟，stale-while-revalidate 平滑刷新 */
const CACHE_HEADERS = { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' }
/** 失败响应不缓存，避免错误被长时间缓存 */
const NO_STORE_HEADERS = { 'Cache-Control': 'no-store' }

/**
 * 失败响应：不缓存，时间戳实时（修复原常量 responseError 时间戳恒定的问题）
 */
export function errorResponse(): NextResponse {
  const body: IResponse = {
    msg: RESPONSE.label(RESPONSE.ERROR),
    code: RESPONSE.ERROR,
    timestamp: Date.now(),
  }
  return NextResponse.json(body, { headers: NO_STORE_HEADERS })
}

/**
 * 成功响应：统一封装 + CDN 缓存头
 */
export function successResponse(list?: HotListItem[]): NextResponse {
  const body: IResponse = {
    msg: RESPONSE.label(RESPONSE.SUCCESS),
    code: RESPONSE.SUCCESS,
    data: list || [],
    timestamp: Date.now(),
  }
  return NextResponse.json(body, { headers: CACHE_HEADERS })
}
