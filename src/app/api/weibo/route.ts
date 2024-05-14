/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-11 14:37:26
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 11:26:15
 * @Description: 微博-热搜榜
 */
import { NextResponse } from 'next/server';

import type { HotListItem } from '@/utils/types';

import { responseError, responseSuccess } from '@/utils';

export async function GET() {
  // 官方 url
  const url = 'https://weibo.com/ajax/side/hotSearch';
  try {
    // 请求数据
    const response = await fetch(url).then(async (res) => await res.json());
    // 处理数据
    if (response.ok === 1) {
      const result: HotListItem[] = response.data.realtime.map((v: Record<string, any>) => {
        const key = v.word_scheme ? v.word_scheme : `#${v.word}`;
        return {
          id: v.mid,
          title: v.word,
          desc: key,
          hot: v.raw_hot,
          label: v.label_name,
          url: `https://s.weibo.com/weibo?q=${encodeURIComponent(key)}&t=31&band_rank=1&Refer=top`,
          mobileUrl: `https://s.weibo.com/weibo?q=${encodeURIComponent(key)}&t=31&band_rank=1&Refer=top`,
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
