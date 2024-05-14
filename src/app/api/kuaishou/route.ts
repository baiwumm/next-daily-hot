/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 10:16:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 10:22:33
 * @Description: 快手-热榜
 */
import { NextResponse } from 'next/server';

import { responseError, responseSuccess } from '@/utils';

export async function GET() {
  // 官方 url
  const url = 'https://www.kuaishou.com/?isHome=1';
  try {
    // 请求数据
    const response = await fetch(url).then(async (res) => await res.text());
    // 处理数据
    const result = [];
    const pattern = /window.__APOLLO_STATE__=(.*);\(function\(\)/s;
    const idPattern = /clientCacheKey=([A-Za-z0-9]+)/s;
    const matchResult = response.match(pattern);
    const jsonObject = JSON.parse(matchResult[1])['defaultClient'];

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
        hot: jsonObject[v.id]['hotValue'].replace('万', '') * 10000,
        url: `https://www.kuaishou.com/short-video/${id}`,
        mobileUrl: `https://www.kuaishou.com/short-video/${id}`,
      });
    });
    return NextResponse.json(responseSuccess(result));
  } catch (error) {
    return NextResponse.json(responseError);
  }
}

// 数据过期时间
export const revalidate = parseInt(process.env.CACHE_TIME || '0');
