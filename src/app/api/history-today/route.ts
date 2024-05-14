/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 10:25:47
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 11:12:54
 * @Description: 百度百科-历史上的今天
 */
import { NextResponse } from 'next/server';

import type { HotListItem } from '@/utils/types';

import { responseError, responseSuccess } from '@/utils';

export async function GET() {
  // 获取月份
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  // 获取天数
  const day = new Date().getDate().toString().padStart(2, '0');
  const url = `https://baike.baidu.com/cms/home/eventsOnHistory/${month}.json`;
  try {
    // 请求数据
    const response = await fetch(url).then(async (res) => await res.json());
    // 处理数据
    const result: HotListItem[] = response[month][month + day].map((v: Record<string, any>, index: number) => {
      return {
        id: index,
        title: v.title.replace(/<[^>]+>/g, ''),
        tip: v.year,
        type: v.type,
        url: v.link,
        mobileUrl: v.link,
      };
    });
    return NextResponse.json(responseSuccess(result));
  } catch (error) {
    return NextResponse.json(responseError);
  }
}

// 数据过期时间
export const revalidate = parseInt(process.env.CACHE_TIME || '0');
