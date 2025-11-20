/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 14:13:34
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 16:54:08
 * @Description: 网易云音乐-新歌榜
 */
import { NextResponse } from 'next/server';

import { REQUEST_STATUS_TEXT } from '@/lib/constant';
import type { HotListItem } from '@/lib/type';
import { convertMillisecondsToTime, responseError, responseSuccess } from '@/lib/utils';

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
    });
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      throw new Error(`${REQUEST_STATUS_TEXT.ERROR}：网易云音乐-新歌榜`);
    }
    // 得到请求体
    const responseBody = await response.json();
    // 处理数据
    if (responseBody.code === 200) {
      const result: HotListItem[] = responseBody.result.tracks.map((v) => {
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
  } catch {
    return NextResponse.json(responseError);
  }
}
