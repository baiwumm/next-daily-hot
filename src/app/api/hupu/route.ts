/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-14 16:54:38
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-14 17:26:28
 * @Description: 虎扑-步行街热帖
 */
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

import { RESPONSE } from '@/enums';
import { responseError, responseSuccess } from '@/lib/utils';

export async function GET() {
  // 官方 url
  const url = 'https://bbs.hupu.com/all-gambia';
  try {
    // 请求数据
    const response = await fetch(url);
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      throw new Error(`${RESPONSE.label(RESPONSE.ERROR)}虎扑-步行街热帖`);
    }
    // 得到请求体
    const responseBody = await response.text();
    const $ = cheerio.load(responseBody);
    const json = $("script").first();
    const data = JSON.parse(json.text().split("window.$$data=")[1])
      .pageData
      .threads;
    const result: App.HotListItem[] = data.map((v) => {
      return {
        id: v.tid,
        title: v.title,
        desc: v.desc,
        pic: v.cover,
        tip: v.lights,
        url: `https://bbs.hupu.com${v.url}`,
        mobileUrl: `https://bbs.hupu.com${v.url}`,
      };
    });
    return NextResponse.json(responseSuccess(result));
  } catch {
    return NextResponse.json(responseError);
  }
}