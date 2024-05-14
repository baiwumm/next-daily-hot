/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:14:07
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 11:23:41
 * @Description: 抖音-热点榜
 */
import { NextResponse } from 'next/server';

import type { HotListItem } from '@/utils/types';

import { responseError, responseSuccess } from '@/utils';

export async function GET() {
  // 官方 url
  const url = 'https://aweme.snssdk.com/aweme/v1/hot/search/list/';
  try {
    // 请求数据
    const response = await fetch(url).then(async (res) => await res.json());
    // 处理数据
    if (response.status_code === 0) {
      const result: HotListItem[] = response.data.word_list.map((v: Record<string, any>) => {
        return {
          id: v.group_id,
          title: v.word,
          pic: `${v.word_cover.url_list[0]}`,
          hot: Number(v.hot_value),
          url: `https://www.douyin.com/hot/${encodeURIComponent(v.sentence_id)}`,
          mobileUrl: `https://www.douyin.com/hot/${encodeURIComponent(v.sentence_id)}`,
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
