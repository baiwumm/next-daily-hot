import type { HotListConfig } from './type'

/**
 * @description: 主题
 */
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const;

/**
 * @description: 请求状态码
 */
export const REQUEST_STATUS = {
  SUCCESS: 200, // 成功
  ERROR: 500, // 失败
} as const;

/**
 * @description: 请求状态对应的文案
 */
export const REQUEST_STATUS_TEXT = {
  SUCCESS: '请求成功',
  ERROR: '请求失败',
} as const;

/**
 * @description: localstorage key
 */
export const LOCAL_KEY = {
  UPDATETIME: 'update-time', // 热榜更新时间
  HOTHIDDEN: 'hot-hidden-values', // 隐藏不显示的热榜列表
} as const;

/**
 * @description: 热榜配置
 */
export const hotCardConfig: HotListConfig[] = [
  { value: 'weibo', label: '微博', tip: '热搜榜' },
  { value: 'bilibili', label: '哔哩哔哩', tip: '热门榜' },
  { value: 'douyin', label: '抖音', tip: '热点榜' },
  { value: 'toutiao', label: '今日头条', tip: '热榜' },
  { value: 'zhihu', label: '知乎', tip: '热榜' },
  { value: 'baidu', label: '百度', tip: '热搜榜' },
  { value: 'baidutieba', label: '百度贴吧', tip: '热议榜' },
  { value: 'qq', label: '腾讯新闻', tip: '热点榜' },
  { value: 'juejin', label: '稀土掘金', tip: '热榜' },
  { value: 'netease', label: '网易新闻', tip: '热榜' },
  { value: 'lol', label: '英雄联盟', tip: '更新公告' },
  { value: 'thepaper', label: '澎湃新闻', tip: '热榜' },
  { value: 'kuaishou', label: '快手', tip: '热榜' },
  { value: 'history-today', label: '百度百科', tip: '历史上的今天', suffix: '年' },
  { value: 'weread', label: '微信读书', tip: '飙升榜' },
  { value: 'douban-movic', label: '豆瓣电影', tip: '新片榜' },
  { value: 'netease-music', label: '网易云音乐', tip: '热歌榜' },
];