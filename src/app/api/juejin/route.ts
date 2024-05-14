/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:47:41
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 09:47:47
 * @Description: 稀土掘金-热榜
 */
import { NextResponse } from 'next/server';

import { responseError, responseSuccess } from '@/utils';

export async function GET() {
  // 官方 url
  const url = 'https://api.juejin.cn/content_api/v1/content/article_rank?category_id=1&type=hot';
  try {
    // 请求数据
    const response = await fetch(url).then(async (res) => await res.json());
    // 处理数据
    if (response.err_msg === 'success') {
      const result = response.data.map((v: Record<string, any>) => {
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
  } catch (error) {
    return NextResponse.json(responseError);
  }
}

// 数据过期时间
export const revalidate = parseInt(process.env.CACHE_TIME || '0');
