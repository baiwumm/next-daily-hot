import { REQUEST_STATUS, REQUEST_STATUS_TEXT } from '@/utils/enum';
import type { IResponse, HotListItem, HotListConfig } from '@/utils/types';

/**
 * @description: 请求成功返回处理结果
 */
export const responseSuccess = (list?: HotListItem[]): IResponse => ({
  msg: REQUEST_STATUS_TEXT.SUCCESS,
  code: REQUEST_STATUS.SUCCESS,
  data: list || [],
});

/**
 * @description: 请求失败返回结果
 */
export const responseError: IResponse = {
  msg: REQUEST_STATUS_TEXT.ERROR,
  code: REQUEST_STATUS.ERROR,
};

/**
 * @description: Tag 颜色配置
 */
export const hotTagColor: Record<string, string> = {
  0: '#ea444d',
  1: '#ed702d',
  2: '#eead3f',
};

/**
 * @description: 微博爆点配置
 */
export const hotLableColor: Record<string, string> = {
  热: '#ff9406',
  沸: '#f86400',
  新: '#ff3852',
  暖: '#ffab5a',
  爆: '#bd0000',
};

/**
 * @description: 转化数字
 */
export const formatNumber = (num: number | string): number | string => {
  num = Number(num);
  if (isNaN(num)) {
    return num;
  }
  // 如果小于 10000，直接显示
  if (num < 10000) {
    return num;
  }
  const unit = '万';
  num /= 10000;
  num = num.toFixed(2);
  return num + unit;
};

/**
 * @description: 热榜配置
 */
export const hotCardConfig: HotListConfig[] = [
  { value: 'weibo', label: '微博', tip: '热搜榜' },
  { value: 'bilibili', label: '哔哩哔哩', tip: '热门榜' },
  { value: 'douyin', label: '抖音', tip: '热点榜' },
];
