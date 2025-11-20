/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-11 14:37:26
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 15:08:28
 * @Description: 微博-热搜榜
 */
import { NextResponse } from 'next/server';

import { REQUEST_STATUS_TEXT } from '@/lib/constant';
import type { HotListItem } from '@/lib/type';
import { responseError, responseSuccess } from '@/lib/utils';

export async function GET() {
  // 官方 url
  const url = 'https://weibo.com/ajax/side/hotSearch';
  try {
    // 请求数据
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://weibo.com/',
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      throw new Error(`${REQUEST_STATUS_TEXT.ERROR}：微博-热搜榜`);
    }
    // 得到请求体
    const responseBody = await response.json();
    // 处理数据
    if (responseBody.ok === 1) {
      const result: HotListItem[] = responseBody.data.realtime.map((v) => {
        const key = v.word_scheme ? v.word_scheme : `#${v.word}`;
        return {
          id: v.mid,
          title: v.word,
          desc: key,
          hot: v.raw_hot,
          label: v.label_name,
          url: `https://s.weibo.com/weibo?q=${encodeURIComponent(key)}&t=31&band_rank=1&Refer=top`,
          mobileUrl: `https://s.weibo.com/weibo?q=${encodeURIComponent(key)}&t=31&band_rank=1&Refer=top`,
        };
      });
      return NextResponse.json(responseSuccess(result));
    }
    return NextResponse.json(responseSuccess());
  } catch {
    return NextResponse.json(responseError);
  }
}

