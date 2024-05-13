/**
 * @description: 榜单类型
 */
export type HotTypes =
  | 'weibo'
  | 'bilibili'
  | 'douyin'
  | 'toutiao'
  | 'zhihu'
  | 'baidu'
  | 'baidutieba'
  | 'qq'
  | 'juejin'
  | 'netease'
  | 'lol'
  | 'thepaper'
  | 'kuaishou'
  | 'today'
  | 'weread'
  | 'douban-movic'
  | 'netease-music';

/**
 * @description: 热榜子项
 */
export type HotListItem = {
  id: string; // 唯一 key
  title: string; // 标题
  desc?: string; // 描述
  pic?: string; // 封面图
  hot: number | string; // 热度
  year?: string; // 年份（历史上的今天）
  score?: number; // 评分（豆瓣电影）
  author?: string; // 作者（音乐）
  duration?: string; // 音乐时长
  url: string; // 地址
  mobileUrl: string; // 移动端地址
  label?: string; // 标签（微博）
};

/**
 * @description: 接口返回数据格式
 */
export type IResponse = {
  code: number;
  msg: string;
  data?: HotListItem[];
};

/**
 * @description: 更新时间
 */
export type UpdateTime = Partial<Record<HotTypes, number>>;

/**
 * @description: 榜单配置
 */
export type HotListConfig = {
  value: HotTypes;
  label: string;
  tip: string;
};
