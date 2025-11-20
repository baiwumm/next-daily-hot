/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:47:41
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 15:10:21
 * @Description: 稀土掘金-热榜
 */
import { NextResponse } from 'next/server';

import { REQUEST_STATUS_TEXT } from '@/lib/constant';
import type { HotListItem } from '@/lib/type';
import { responseError, responseSuccess } from '@/lib/utils';

export async function GET() {
  // 官方 url
  const url = 'https://api.juejin.cn/content_api/v1/content/article_rank?category_id=1&type=hot';
  try {
    // 请求数据
    const response = await fetch(url);
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      throw new Error(`${REQUEST_STATUS_TEXT.ERROR}：稀土掘金-热榜`);
    }
    // 得到请求体
    const responseBody = await response.json();
    // 处理数据
    if (responseBody.err_msg === 'success') {
      const result: HotListItem[] = responseBody.data.map((v) => {
        return {
          id: v.content.content_id,
          title: v.content.title,
          hot: v.content_counter.hot_rank,
          url: `https://juejin.cn/post/${v.content.content_id}`,
          mobileUrl: `https://juejin.cn/post/${v.content.content_id}`,
        };
      });
      return NextResponse.json(responseSuccess(result));
    }
    return NextResponse.json(responseSuccess());
  } catch {
    return NextResponse.json(responseError);
  }
}
