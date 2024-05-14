/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 14:13:34
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 14:16:09
 * @Description: 网易云音乐-新歌榜
 */
import { NextResponse } from 'next/server';

import type { HotListItem } from '@/utils/types';

import { responseError, responseSuccess, convertMillisecondsToTime } from '@/utils';

export async function GET() {
  // 官方 url
  const url = 'https://music.163.com/api/playlist/detail?id=3778678';
  try {
    // 请求数据
    const response = await fetch(url, {
      headers: {
        authority: 'music.163.com',
        referer: 'https://music.163.com/',
      },
    }).then(async (res) => await res.json());
    // 处理数据
    if (response.code === 200) {
      const result: HotListItem[] = response.result.tracks.map((v: Record<string, any>) => {
        return {
          id: v.id,
          title: v.name,
          author: v.artists.map((item: { name: string }) => item.name).join('/'),
          pic: v.album.picUrl,
          tip: convertMillisecondsToTime(v.duration),
          url: `https://music.163.com/#/song?id=${v.id}`,
          mobileUrl: `https://music.163.com/m/song?id=${v.id}`,
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
