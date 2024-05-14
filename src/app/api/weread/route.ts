/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 11:27:32
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 11:31:56
 * @Description: 微信读书-飙升榜
 */
import { NextResponse } from 'next/server';

import type { HotListItem } from '@/utils/types';

import { responseError, responseSuccess, getWereadID } from '@/utils';

export async function GET() {
  // 官方 url
  const url = 'https://weread.qq.com/web/bookListInCategory/rising?rank=1';
  try {
    // 请求数据
    const response = await fetch(url).then(async (res) => await res.json());
    // 处理数据
    if (response.books) {
      const result: HotListItem[] = response.books.map((v: Record<string, any>) => {
        const info = v.bookInfo;
        return {
          id: info.bookId,
          title: info.title,
          hot: v.readingCount,
          pic: info.cover.replace('s_', 't9_'),
          url: `https://weread.qq.com/web/bookDetail/${getWereadID(info.bookId)}`,
          mobileUrl: `https://weread.qq.com/web/bookDetail/${getWereadID(info.bookId)}`,
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
