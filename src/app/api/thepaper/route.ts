/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 10:12:17
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 11:25:43
 * @Description: 澎湃新闻-热榜
 */
import { NextResponse } from 'next/server';

import type { HotListItem } from '@/utils/types';

import { responseError, responseSuccess } from '@/utils';

export async function GET() {
  // 官方 url
  const url = 'https://cache.thepaper.cn/contentapi/wwwIndex/rightSidebar';
  try {
    // 请求数据
    const response = await fetch(url).then(async (res) => await res.json());
    // 处理数据
    if (response.resultCode === 1) {
      const result: HotListItem[] = response.data.hotNews.map((v: Record<string, any>) => {
        return {
          id: v.contId,
          title: v.name,
          pic: v.pic,
          hot: v.praiseTimes,
          url: `https://www.thepaper.cn/newsDetail_forward_${v.contId}`,
          mobileUrl: `https://m.thepaper.cn/newsDetail_forward_${v.contId}`,
        };
      });
      return NextResponse.json(responseSuccess(result));
    }
    return NextResponse.json(responseSuccess());
  } catch (error) {
    return NextResponse.json(responseError);
  }
}

// 数据过期时间
export const revalidate = parseInt(process.env.CACHE_TIME || '0');
