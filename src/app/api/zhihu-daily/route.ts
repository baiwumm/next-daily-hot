/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-26 15:16:29
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-26 15:23:23
 * @Description: 知乎日报 - 推荐榜
 */
import { NextResponse } from 'next/server';

import { RESPONSE } from '@/enums';
import { responseError, responseSuccess } from '@/lib/utils';

export async function GET() {
  // 官方 url
  const url = 'https://daily.zhihu.com/api/4/news/latest';
  try {
    // 请求数据
    const response = await fetch(url, {
      headers: {
        Referer: "https://daily.zhihu.com/api/4/news/latest",
        Host: "daily.zhihu.com",
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      },
    });
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      throw new Error(`${RESPONSE.label(RESPONSE.ERROR)}：知乎日报 - 推荐榜`);
    }
    // 得到请求体
    const responseBody = await response.json();
    const data = responseBody?.stories;
    if (!data) {
      return NextResponse.json(responseSuccess());
    }
    const result: App.HotListItem[] = data.map((v) => {
      return {
        id: v.id,
        title: v.title,
        url: v.url,
        mobileUrl: v.url,
      };
    });
    return NextResponse.json(responseSuccess(result));
  } catch {
    return NextResponse.json(responseError);
  }
}