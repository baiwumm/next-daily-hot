import { RESPONSE } from '@/enums/response'

import type { HotListItem, IResponse } from '@/types'

/**
 * @description: 请求成功返回处理结果
 */
export function responseSuccess(list?: HotListItem[]): IResponse {
  return {
    msg: RESPONSE.label(RESPONSE.SUCCESS),
    code: RESPONSE.SUCCESS,
    data: list || [],
    timestamp: Date.now(),
  }
}

/**
 * @description: 请求失败返回结果
 */
export const responseError: IResponse = {
  msg: RESPONSE.label(RESPONSE.ERROR),
  code: RESPONSE.ERROR,
  timestamp: Date.now(),
}

/**
 * @description: 相对时间文本（原生实现，等价于 dayjs 的 fromNow + zh-cn locale）
 */
export function fromNow(timestamp: number): string {
  const diffSec = (Date.now() - timestamp) / 1000
  const future = diffSec < 0
  const suffix = future ? '后' : '前'
  const abs = Math.abs(diffSec)

  // 分档阈值与 dayjs relativeTime 插件默认配置一致
  if (abs <= 44)
    return `几秒${suffix}`
  if (abs <= 89)
    return `1 分钟${suffix}`

  const minutes = Math.round(abs / 60)
  if (minutes <= 44)
    return `${minutes} 分钟${suffix}`
  if (minutes <= 89)
    return `1 小时${suffix}`

  const hours = Math.round(abs / 3600)
  if (hours <= 21)
    return `${hours} 小时${suffix}`
  if (hours <= 35)
    return `1 天${suffix}`

  const days = Math.round(abs / 86400)
  if (days <= 25)
    return `${days} 天${suffix}`
  if (days <= 45)
    return `1 个月${suffix}`

  const months = Math.round(abs / (30 * 86400))
  if (months <= 10)
    return `${months} 个月${suffix}`
  if (months <= 17)
    return `1 年${suffix}`

  return `${Math.round(abs / (365 * 86400))} 年${suffix}`
}

/**
 * @description: Tag 颜色配置
 */
export const hotTagColor = ['#ea444d', '#ed702d', '#eead3f']

/**
 * @description: 微博爆点配置
 */
export const hotLableColor: Record<string, string> = {
  热: '#ff9406',
  沸: '#f86400',
  新: '#ff3852',
  暖: '#ffab5a',
  爆: '#bd0000',
}

/**
 * @description: 根据时间戳计算时长
 */
export function convertMillisecondsToTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = (n: number) => n.toString().padStart(2, '0')

  // 超过 1 小时显示 HH:MM:SS，否则保持 MM:SS
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`
}

/**
 * @description: 转化数字
 */
export function formatNumber(value: number | string): number | string {
  if (value === null || value === undefined)
    return value

  let num: number

  // 1️⃣ 纯数字或数字字符串
  if (typeof value === 'number' || /^\d+(?:\.\d+)?$/.test(value)) {
    num = Number(value)
  }
  // 2️⃣ 带 w / 万
  else if (/^\d+(?:\.\d+)?\s*(?:w|万)$/i.test(value)) {
    num = Number.parseFloat(value) * 10000
  }
  // 3️⃣ 带 k / 千（可选）
  else if (/^\d+(?:\.\d+)?\s*(?:k|千)$/i.test(value)) {
    num = Number.parseFloat(value) * 1000
  }
  // 4️⃣ 其他情况，原样返回
  else {
    return value
  }

  return new Intl.NumberFormat('zh-CN', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
  }).format(num)
}
