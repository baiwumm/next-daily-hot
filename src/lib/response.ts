import type { HotListItem, IResponse } from '@/types'

import { NextResponse } from 'next/server'

import { API_CACHE_SECONDS, RESPONSE } from '@/enums/response'

/**
 * 成功响应缓存头：CDN 边缘缓存窗口与服务端 fetch revalidate、客户端刷新冷却三层同源，
 * 均取自 API_CACHE_SECONDS，stale-while-revalidate 平滑刷新
 */
const CACHE_HEADERS = { 'Cache-Control': `public, s-maxage=${API_CACHE_SECONDS}, stale-while-revalidate=60` }
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
 * 空数据按不缓存处理：客户端把空列表视为失败会立即重试，
 * 若被 CDN 缓存会把这份空结果钉住整个缓存窗口，重试拿到的始终是同一份空数据
 */
export function successResponse(list?: HotListItem[]): NextResponse {
  const data = list || []
  const body: IResponse = {
    msg: RESPONSE.label(RESPONSE.SUCCESS),
    code: RESPONSE.SUCCESS,
    data,
    timestamp: Date.now(),
  }

  return NextResponse.json(body, { headers: data.length ? CACHE_HEADERS : NO_STORE_HEADERS })
}
