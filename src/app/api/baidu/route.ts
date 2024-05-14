/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:33:19
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 09:34:38
 * @Description: 百度-热搜榜
 */
import { NextResponse } from 'next/server';

import { responseError, responseSuccess } from '@/utils';

export async function GET() {
  // 官方 url
  const url = 'https://top.baidu.com/api/board?platform=wise&tab=realtime';
  try {
    // 请求数据
    const response = await fetch(url).then(async (res) => await res.json());
    // 处理数据
    if (response.success) {
      const result = response.data.cards[0].content.map((v: Record<string, any>, index: number) => {
        return {
          id: index + v.hotScore,
          title: v.word,
          desc: v.desc,
          pic: v.img,
          hot: Number(v.hotScore),
          url: `https://www.baidu.com/s?wd=${encodeURIComponent(v.query)}`,
          mobileUrl: v.url,
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
