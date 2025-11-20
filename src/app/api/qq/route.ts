/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:42:24
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 15:09:30
 * @Description: 腾讯新闻-热点榜
 */
import { NextResponse } from 'next/server';

import { REQUEST_STATUS_TEXT } from '@/lib/constant';
import type { HotListItem } from '@/lib/type';
import { responseError, responseSuccess } from '@/lib/utils';

export async function GET() {
  // 官方 url
  const url = 'https://r.inews.qq.com/gw/event/hot_ranking_list';
  try {
    // 请求数据
    const response = await fetch(url);
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      throw new Error(`${REQUEST_STATUS_TEXT.ERROR}：腾讯新闻-热点榜`);
    }
    // 得到请求体
    const responseBody = await response.json();
    // 处理数据
    if (responseBody.ret === 0) {
      const result: HotListItem[] = responseBody.idlist[0].newslist.slice(1).map((v) => {
        return {
          id: v.id,
          title: v.title,
          desc: v.abstract,
          pic: v.miniProShareImage,
          hot: v.readCount,
          url: `https://new.qq.com/rain/a/${v.id}`,
          mobileUrl: `https://view.inews.qq.com/a/${v.id}`,
        };
      });
      return NextResponse.json(responseSuccess(result));
    }
    return NextResponse.json(responseSuccess());
  } catch {
    return NextResponse.json(responseError);
  }
}
