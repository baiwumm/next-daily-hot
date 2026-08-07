import CryptoJS from 'crypto-js'

import { RESPONSE } from '@/enums'

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
  const seconds = Math.floor((milliseconds / 1000) % 60)
  const minutes = Math.floor(milliseconds / (1000 * 60))

  // 如果秒数小于10，前面补0
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString()

  // 如果分钟数小于10，前面补0
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString()

  return `${formattedMinutes}:${formattedSeconds}`
}

/**
 * @description: 转化数字
 */
export function formatNumber(value: number | string): number | string {
  if (value === null || value === undefined)
    return value

  let num: number

  // 1️⃣ 纯数字或数字字符串
  if (typeof value === 'number' || /^\d+(\.\d+)?$/.test(value)) {
    num = Number(value)
  }
  // 2️⃣ 带 w / 万
  else if (/^\d+(\.\d+)?\s*(w|万)$/i.test(value)) {
    num = Number.parseFloat(value) * 10000
  }
  // 3️⃣ 带 k / 千（可选）
  else if (/^\d+(\.\d+)?\s*(k|千)$/i.test(value)) {
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

/**
 * 获取微信读书的书籍 ID
 * 感谢 @MCBBC 及 ChatGPT
 */
export function getWereadID(bookId: string) {
  try {
    // 使用 MD5 哈希算法创建哈希对象
    const str = CryptoJS.MD5(bookId).toString()
    // 取哈希结果的前三个字符作为初始值
    let strSub = str.substring(0, 3)
    // 判断书籍 ID 的类型并进行转换
    let fa
    if (/^\d*$/.test(bookId)) {
      // 如果书籍 ID 只包含数字，则将其拆分成长度为 9 的子字符串，并转换为十六进制表示
      const chunks = []
      for (let i = 0; i < bookId.length; i += 9) {
        const chunk = bookId.substring(i, i + 9)
        chunks.push(parseInt(chunk).toString(16))
      }
      fa = ['3', chunks]
    }
    else {
      // 如果书籍 ID 包含其他字符，则将每个字符的 Unicode 编码转换为十六进制表示
      let hexStr = ''
      for (let i = 0; i < bookId.length; i++) {
        hexStr += bookId.charCodeAt(i).toString(16)
      }
      fa = ['4', [hexStr]]
    }
    // 将类型添加到初始值中
    strSub += fa[0]
    // 将数字 2 和哈希结果的后两个字符添加到初始值中
    strSub += `2${str.substring(str.length - 2)}`
    // 处理转换后的子字符串数组
    for (let i = 0; i < fa[1].length; i++) {
      const sub = fa[1][i]
      const subLength = sub.length.toString(16)
      // 如果长度只有一位数，则在前面添加 0
      const subLengthPadded = subLength.length === 1 ? `0${subLength}` : subLength
      // 将长度和子字符串添加到初始值中
      strSub += subLengthPadded + sub
      // 如果不是最后一个子字符串，则添加分隔符 'g'
      if (i < fa[1].length - 1) {
        strSub += 'g'
      }
    }
    // 如果初始值长度不足 20，从哈希结果中取足够的字符补齐
    if (strSub.length < 20) {
      strSub += str.substring(0, 20 - strSub.length)
    }
    // 使用 MD5 哈希算法创建新的哈希对象
    const finalStr = CryptoJS.MD5(strSub).toString()
    // 取最终哈希结果的前三个字符并添加到初始值的末尾
    strSub += finalStr.substring(0, 3)
    return strSub
  }
  catch (error) {
    console.error(`处理微信读书 ID 时出现错误：${error}`)
    return null
  }
}
