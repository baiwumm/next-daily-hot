import { Enum } from 'enum-plus';
import { Star } from 'lucide-react';

/**
 * @description: 请求状态
 */
export const RESPONSE = Enum({
  SUCCESS: { value: 200, label: '请求成功' },
  ERROR: { value: 500, label: '请求失败' }
})

/**
 * @description: 主题模式
 */
export const THEME_MODE = Enum({
  LIGHT: { value: 'light', label: '浅色模式', icon: 'sun' },
  DARK: { value: 'dark', label: '深色模式', icon: 'moon' },
  SYSTEM: { value: 'system', label: '跟随系统', icon: 'laptop' }
});

/**
 * @description: 热榜子项
 */
export const HOT_ITEMS = Enum({
  WEIBO: { value: 'weibo', label: '微博', tip: '热搜榜' },
  XIAOHONGSHU: { value: 'xiaohongshu', label: '小红书', tip: '实时热榜' },
  BILIBILI: { value: 'bilibili', label: '哔哩哔哩', tip: '热门榜' },
  DOUYIN: { value: 'douyin', label: '抖音', tip: '热点榜' },
  TOUTIAO: { value: 'toutiao', label: '今日头条', tip: '热榜' },
  ZHIHU: { value: 'zhihu', label: '知乎', tip: '热榜' },
  BAIDU: { value: 'baidu', label: '百度', tip: '热搜榜' },
  BAIDU_TIEBA: { value: 'baidutieba', label: '百度贴吧', tip: '热议榜' },
  QQ: { value: 'qq', label: '腾讯新闻', tip: '热点榜' },
  HUPU: { value: 'hupu', label: '虎扑', tip: '步行街热帖', suffix: '亮' },
  JUEJIN: { value: 'juejin', label: '稀土掘金', tip: '热榜' },
  GITHUB_TRENDING: { value: 'github-trending', label: 'Github', tip: '热门仓库', suffix: <Star size={12} /> },
  HELLO_GITHUB: { value: 'hello-github', label: 'HelloGithub', tip: '精选' },
  CSDN: { value: 'csdn', label: 'CSDN', tip: '热榜' },
  NETEASE: { value: 'netease', label: '网易新闻', tip: '热榜' },
  QUARK: { value: 'quark', label: '夸克', tip: '今日热点' },
  LOL: { value: 'lol', label: '英雄联盟', tip: '更新公告' },
  THEPAPER: { value: 'thepaper', label: '澎湃新闻', tip: '热榜' },
  KUAISHOU: { value: 'kuaishou', label: '快手', tip: '热榜' },
  DONGCHEDI: { value: 'dongchedi', label: '懂车帝', tip: '热搜榜' },
  HISTORY_TODAY: { value: 'history-today', label: '百度百科', tip: '历史上的今天', suffix: '年' },
  WEREAD: { value: 'weread', label: '微信读书', tip: '飙升榜' },
  DOUBAN_MOVIC: { value: 'douban-movic', label: '豆瓣电影', tip: '新片榜' },
  NETEASE_MUSIC: { value: 'netease-music', label: '网易云音乐', tip: '热歌榜' },
})