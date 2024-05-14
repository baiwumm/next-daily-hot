/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:19:59
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 09:22:01
 * @Description: 今日头条-热榜
 */
import { NextResponse } from 'next/server';

import { responseError, responseSuccess } from '@/utils';

export async function GET() {
  // 官方 url
  const url = 'https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc';
  try {
    // 请求数据
    const response = await fetch(url).then(async (res) => await res.json());
    // 处理数据
    if (response.status === 'success') {
      const result = response.data.map((v: Record<string, any>) => {
        return {
          id: v.ClusterId,
          title: v.Title,
          pic: v.Image.url,
          hot: v.HotValue,
          url: `https://www.toutiao.com/trending/${v.ClusterIdStr}/`,
          mobileUrl: `https://api.toutiaoapi.com/feoffline/amos_land/new/html/main/index.html?topic_id=${v.ClusterIdStr}`,
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
