/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 10:16:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 15:10:10
 * @Description: 快手-热榜
 */
import { NextResponse } from 'next/server';

import { REQUEST_STATUS_TEXT } from '@/lib/constant';
import type { HotListItem } from '@/lib/type';
import { responseError, responseSuccess } from '@/lib/utils';

export async function GET() {
  // 官方 url
  const url = 'https://www.kuaishou.com/?isHome=1';
  try {
    // 请求数据
    const response = await fetch(url);
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      throw new Error(`${REQUEST_STATUS_TEXT.ERROR}：快手-热榜`);
    }
    // 得到请求体
    const responseBody = await response.text();
    // 处理数据
    const result: HotListItem[] = [];
    const pattern = /window.__APOLLO_STATE__=(.*);\(function\(\)/s;
    const idPattern = /clientCacheKey=([A-Za-z0-9]+)/s;
    const matchResult = responseBody.match(pattern);
    const jsonObject = matchResult ? JSON.parse(matchResult[1])['defaultClient'] : [];

    // 获取所有分类
    const allItems = jsonObject['$ROOT_QUERY.visionHotRank({"page":"home"})']['items'];
    // 遍历所有分类
    allItems.forEach((v) => {
      // 基础数据
      const image = jsonObject[v.id]['poster'];
      const id = image.match(idPattern)[1];
      // 数据处理
      result.push({
        id,
        title: jsonObject[v.id]['name'],
        hot: jsonObject[v.id]['hotValue']?.replace('万', '') * 10000,
        url: `https://www.kuaishou.com/short-video/${id}`,
        mobileUrl: `https://www.kuaishou.com/short-video/${id}`,
      });
    });
    return NextResponse.json(responseSuccess(result));
  } catch {
    return NextResponse.json(responseError);
  }
}
