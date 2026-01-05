/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:54:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-04 18:09:43
 * @Description: 英雄联盟-更新公告
 */
import { NextResponse } from 'next/server';

import { RESPONSE } from '@/enums';
import { responseError, responseSuccess } from '@/lib/utils';

export async function GET() {
  // 官方 url
  const url = 'https://apps.game.qq.com/cmc/zmMcnTargetContentList?page=1&num=50&target=24&source=web_pc';
  try {
    // 请求数据
    const response = await fetch(url);
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      throw new Error(`${RESPONSE.label(RESPONSE.ERROR)}：英雄联盟-更新公告`);
    }
    // 得到请求体
    const responseBody = await response.json();
    // 处理数据
    if (responseBody.status === 1) {
      const result: App.HotListItem[] = responseBody.data.result.map((v) => {
        return {
          id: v.iDocID,
          title: v.sTitle,
          desc: v.sAuthor,
          pic: v.sIMG,
          hot: Number(v.iTotalPlay),
          url: `https://lol.qq.com/news/detail.shtml?docid=${encodeURIComponent(v.iDocID)}`,
          mobileUrl: `https://lol.qq.com/news/detail.shtml?docid=${encodeURIComponent(v.iDocID)}`,
        };
      });
      return NextResponse.json(responseSuccess(result));
    }
    return NextResponse.json(responseSuccess());
  } catch {
    return NextResponse.json(responseError);
  }
}
