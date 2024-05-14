/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:54:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 10:06:06
 * @Description: 英雄联盟-更新公告
 */
import { NextResponse } from 'next/server';

import { responseError, responseSuccess } from '@/utils';

export async function GET() {
  // 官方 url
  const url = 'https://apps.game.qq.com/cmc/zmMcnTargetContentList?page=1&num=50&target=24&source=web_pc';
  try {
    // 请求数据
    const response = await fetch(url).then(async (res) => await res.json());
    // 处理数据
    if (response.status === 1) {
      const result = response.data.result.map((v: Record<string, any>) => {
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
  } catch (error) {
    return NextResponse.json(responseError);
  }
}

// 数据过期时间
export const revalidate = parseInt(process.env.CACHE_TIME || '0');
