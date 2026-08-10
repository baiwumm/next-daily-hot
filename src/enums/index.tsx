import { Star } from '@gravity-ui/icons'

import type { ReactNode } from 'react'

/**
 * @description: 请求状态
 */
const responseConfig = {
  SUCCESS: { value: 200, label: '请求成功' },
  ERROR: { value: 500, label: '请求失败' },
} as const

/** 请求状态码类型 */
export type ResponseValue = (typeof responseConfig)[keyof typeof responseConfig]['value']

export const RESPONSE = {
  SUCCESS: responseConfig.SUCCESS.value,
  ERROR: responseConfig.ERROR.value,
  /** 根据状态码获取文案 */
  label: (value: ResponseValue) =>
    value === responseConfig.SUCCESS.value ? responseConfig.SUCCESS.label : responseConfig.ERROR.label,
}

/**
 * @description: 热榜子项配置（唯一数据源）
 */
const hotItemsConfig = {
  'WEIBO': { value: 'weibo', label: '微博', tip: '热搜榜' },
  'XIAOHONGSHU': { value: 'xiaohongshu', label: '小红书', tip: '实时热榜' },
  'BILIBILI': { value: 'bilibili', label: '哔哩哔哩', tip: '热门榜' },
  'DOUYIN': { value: 'douyin', label: '抖音', tip: '热点榜' },
  'TOUTIAO': { value: 'toutiao', label: '今日头条', tip: '热榜' },
  'ZHIHU': { value: 'zhihu', label: '知乎', tip: '热榜' },
  'BAIDU': { value: 'baidu', label: '百度', tip: '热搜榜' },
  'BAIDU_TIEBA': { value: 'baidutieba', label: '百度贴吧', tip: '热议榜' },
  'QQ': { value: 'qq', label: '腾讯新闻', tip: '热点榜' },
  'HUPU': { value: 'hupu', label: '虎扑', tip: '步行街热帖', suffix: '亮' },
  'JUEJIN': { value: 'juejin', label: '稀土掘金', tip: '热榜' },
  'GITHUB_TRENDING': { value: 'github-trending', label: 'Github', tip: '热门仓库', suffix: <Star width={12} /> },
  'HELLO_GITHUB': { value: 'hello-github', label: 'HelloGithub', tip: '精选' },
  'CSDN': { value: 'csdn', label: 'CSDN', tip: '热榜' },
  'NETEASE': { value: 'netease', label: '网易新闻', tip: '热榜' },
  'QUARK': { value: 'quark', label: '夸克', tip: '今日热点' },
  'LOL': { value: 'lol', label: '英雄联盟', tip: '更新公告' },
  'THEPAPER': { value: 'thepaper', label: '澎湃新闻', tip: '热榜' },
  'KUAISHOU': { value: 'kuaishou', label: '快手', tip: '热榜' },
  'DONGCHEDI': { value: 'dongchedi', label: '懂车帝', tip: '热搜榜' },
  'HISTORY_TODAY': { value: 'history-today', label: '百度百科', tip: '历史上的今天', suffix: '年' },
  'WEREAD': { value: 'weread', label: '微信读书', tip: '飙升榜' },
  'DOUBAN_MOVIC': { value: 'douban-movic', label: '豆瓣电影', tip: '新片榜' },
  'NETEASE_MUSIC': { value: 'netease-music', label: '网易云音乐', tip: '热歌榜' },
  'WOSHIPM': { value: 'woshipm', label: '人人都是产品经理', tip: '热榜' },
  '36KR': { value: '36kr', label: '36氪', tip: '24小时热榜' },
  'HUXIU': { value: 'huxiu', label: '虎嗅', tip: '最新资讯' },
  'ZHIHU_DAILY': { value: 'zhihu-daily', label: '知乎日报', tip: '推荐榜' },
  'IFANR': { value: 'ifanr', label: '爱范儿', tip: '快讯' },
  'ITHOME': { value: 'ithome', label: 'IT之家', tip: '热榜' },
} as const

/** 热榜子项（与 enum-plus 的 items 形状保持一致） */
export interface HotItem {
  key: HotKey
  value: HotValue
  label: string
  tip: string
  suffix?: ReactNode
  raw: HotRaw
}

/** 热榜 key 类型 */
export type HotKey = keyof typeof hotItemsConfig
/** 热榜项原始配置 */
export type HotRaw = (typeof hotItemsConfig)[HotKey]
/** 热榜 value 类型 */
export type HotValue = (typeof hotItemsConfig)[HotKey]['value']

const hotItems: HotItem[] = (Object.entries(hotItemsConfig) as [HotKey, HotRaw][]).map(([key, raw]) => ({
  key,
  value: raw.value,
  label: raw.label,
  tip: raw.tip,
  suffix: 'suffix' in raw ? raw.suffix : undefined,
  raw,
}))

const hotValues: HotValue[] = hotItems.map(item => item.value)

const hotRawMap = Object.fromEntries(
  hotItems.map(item => [item.value, item.raw]),
) as Record<HotValue, HotRaw>

export const HOT_ITEMS = {
  items: hotItems,
  values: hotValues,
  /** 根据 value 获取原始配置 */
  raw: (value: HotValue): HotRaw | undefined => hotRawMap[value],
}
