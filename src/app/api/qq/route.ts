/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:42:24
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 11:25:30
 * @Description: 腾讯新闻-热点榜
 */
import { NextResponse } from 'next/server';

import type { HotListItem } from '@/utils/types';

import { responseError, responseSuccess } from '@/utils';

export async function GET() {
  // 官方 url
  const url = 'https://r.inews.qq.com/gw/event/hot_ranking_list';
  try {
    // 请求数据
    const response = await fetch(url).then(async (res) => await res.json());
    // 处理数据
    if (response.ret === 0) {
      const result: HotListItem[] = response.idlist[0].newslist.slice(1).map((v: Record<string, any>) => {
        return {
          id: v.id,
          title: v.title,
          desc: v.abstract,
          pic: v.miniProShareImage,
          hot: v.readCount,
          url: `https://new.qq.com/rain/a/${v.id}`,
          mobileUrl: `https://view.inews.qq.com/a/${v.id}`,
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
