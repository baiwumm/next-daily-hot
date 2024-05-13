/**
 * @description: 主题模式
 */
export enum THEME_MODE {
  SYSTEM = 'system', // 跟随系统
  LIGHT = 'light', // 浅色
  DARK = 'dark', // 深色
}

/**
 * @description: 请求状态码
 */
export enum REQUEST_STATUS {
  SUCCESS = 200, // 成功
  ERROR = 500, // 失败
}

/**
 * @description: 请求状态对应的文案
 */
export enum REQUEST_STATUS_TEXT {
  SUCCESS = '请求成功',
  ERROR = '请求失败',
}

/**
 * @description: localstorage key
 */
export enum LOCAL_KEY {
  UPDATETIME = 'update-time', // 热榜更新时间
  HOTHIDDEN = 'hot-hidden', // 隐藏不显示的热榜列表
}
