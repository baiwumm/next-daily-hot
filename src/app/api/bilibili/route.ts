/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-13 16:25:11
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 11:23:24
 * @Description: 哔哩哔哩-热门榜
 */
import { NextResponse } from 'next/server';

import type { HotListItem } from '@/utils/types';

import { responseError, responseSuccess } from '@/utils';

export async function GET() {
  // 官方 url
  const url = 'https://api.bilibili.com/x/web-interface/ranking/v2';
  try {
    // 请求数据
    const response = await fetch(url, {
      headers: {
        Referer: `https://www.bilibili.com/ranking/all`,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      },
    }).then(async (res) => await res.json());
    // 处理数据
    if (response.code === 0) {
      const result: HotListItem[] = response.data.list.map((v: Record<string, any>) => {
        return {
          id: v.bvid,
          title: v.title,
          desc: v.desc,
          pic: v.pic.replace(/http:/, 'https:'),
          hot: v.stat.view,
          url: v.short_link_v2 || `https://b23.tv/${v.bvid}`,
          mobileUrl: `https://m.bilibili.com/video/${v.bvid}`,
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
