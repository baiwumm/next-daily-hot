/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:50:55
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 15:09:53
 * @Description: 网易新闻-热榜
 */
import { NextResponse } from 'next/server';

import { REQUEST_STATUS_TEXT } from '@/lib/constant';
import type { HotListItem } from '@/lib/type';
import { responseError, responseSuccess } from '@/lib/utils';

export async function GET() {
  // 官方 url
  const url = 'https://m.163.com/fe/api/hot/news/flow';
  try {
    // 请求数据
    const response = await fetch(url);
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      throw new Error(`${REQUEST_STATUS_TEXT.ERROR}：网易新闻-热榜`);
    }
    // 得到请求体
    const responseBody = await response.json();
    // 处理数据
    if (responseBody.msg === 'success') {
      const result: HotListItem[] = responseBody.data.list.map((v) => {
        return {
          id: v.skipID,
          title: v.title,
          desc: v._keyword,
          pic: v.imgsrc,
          url: `https://www.163.com/dy/article/${v.skipID}.html`,
          mobileUrl: v.url,
        };
      });
      return NextResponse.json(responseSuccess(result));
    }
    return NextResponse.json(responseSuccess());
  } catch {
    return NextResponse.json(responseError);
  }
}
