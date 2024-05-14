/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:28:41
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 11:26:31
 * @Description: 知乎-热榜
 */
import { NextResponse } from 'next/server';

import type { HotListItem } from '@/utils/types';

import { responseError, responseSuccess } from '@/utils';

export async function GET() {
  // 官方 url
  const url = 'https://api.zhihu.com/topstory/hot-list';
  try {
    // 请求数据
    const response = await fetch(url).then(async (res) => await res.json());
    // 处理数据
    if (response.data) {
      const result: HotListItem[] = response.data.map((v: Record<string, any>) => {
        return {
          id: v.id,
          title: v.target.title,
          pic: v.children[0].thumbnail,
          hot: parseInt(v.detail_text.replace(/[^\d]/g, '')) * 10000,
          url: `https://www.zhihu.com/question/${v.target.id}`,
          mobileUrl: `https://www.zhihu.com/question/${v.target.id}`,
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
