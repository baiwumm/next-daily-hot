/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:38:02
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 15:01:25
 * @Description: 百度贴吧-热议榜
 */
import { NextResponse } from 'next/server';

import { REQUEST_STATUS_TEXT } from '@/lib/constant';
import type { HotListItem } from '@/lib/type';
import { responseError, responseSuccess } from '@/lib/utils';

export async function GET() {
  // 官方 url
  const url = 'https://tieba.baidu.com/hottopic/browse/topicList';
  try {
    // 请求数据
    const response = await fetch(url);
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      throw new Error(`${REQUEST_STATUS_TEXT.ERROR}：百度贴吧-热议榜`);
    }
    // 得到请求体
    const responseBody = await response.json();
    // 处理数据
    if (responseBody.errmsg === 'success') {
      const result: HotListItem[] = responseBody.data.bang_topic.topic_list.map((v) => {
        return {
          id: v.topic_id.toString(),
          title: v.topic_name,
          desc: v.topic_desc,
          pic: v.topic_pic,
          hot: v.discuss_num,
          url: v.topic_url,
          mobileUrl: v.topic_url,
        };
      });
      return NextResponse.json(responseSuccess(result));
    }
    return NextResponse.json(responseSuccess());
  } catch {
    return NextResponse.json(responseError);
  }
}
