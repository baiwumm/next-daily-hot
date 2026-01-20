/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-20 15:22:39
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-20 17:41:57
 * @Description: HelloGithub - 精选
 */
import { NextResponse } from 'next/server';

import { RESPONSE } from '@/enums';
import { responseError, responseSuccess } from '@/lib/utils';

export async function GET() {
  // 官方 url
  const url = 'https://api.hellogithub.com/v1/?sort_by=featured&page=1&rank_by=newest&tid=all';
  try {
    // 请求数据
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      throw new Error(`${RESPONSE.label(RESPONSE.ERROR)}HelloGithub - 精选`);
    }
    // 得到请求体
    const responseBody = await response.json();
    console.log('responseBody', responseBody)
    // 处理数据
    if (responseBody.success) {
      const result: App.HotListItem[] = responseBody.data.map((v) => {
        return {
          id: v.item_id,
          title: `${v.name}-${v.title}`,
          desc: v.summary,
          hot: v.clicks_total,
          url: `https://hellogithub.com/repository/${v.full_name}`,
          mobileUrl: `https://hellogithub.com/repository/${v.full_name}`,
        };
      });
      return NextResponse.json(responseSuccess(result));
    }
    return NextResponse.json(responseSuccess());
  } catch (err) {
    console.log(err)
    return NextResponse.json(responseError);
  }
}
