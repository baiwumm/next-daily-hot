/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-13 16:25:11
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 15:11:00
 * @Description: 哔哩哔哩-热门榜
 */
import { NextResponse } from 'next/server';

import { REQUEST_STATUS_TEXT } from '@/lib/constant';
import type { HotListItem } from '@/lib/type';
import { responseError, responseSuccess } from '@/lib/utils';

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
    });
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      throw new Error(`${REQUEST_STATUS_TEXT.ERROR}：哔哩哔哩-热门榜`);
    }
    // 得到请求体
    const responseBody = await response.json();
    const data = responseBody?.data?.realtime || responseBody?.data?.list;
    if (!data) {
      return NextResponse.json(responseSuccess());
    }
    const result: HotListItem[] = data.map((v) => {
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
  } catch {
    return NextResponse.json(responseError);
  }
}
