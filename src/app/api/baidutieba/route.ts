/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-14 09:38:02
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 11:22:58
 * @Description: 百度贴吧-热议榜
 */
import { NextResponse } from 'next/server';

import type { HotListItem } from '@/utils/types';

import { responseError, responseSuccess } from '@/utils';

export async function GET() {
  // 官方 url
  const url = 'https://tieba.baidu.com/hottopic/browse/topicList';
  try {
    // 请求数据
    const response = await fetch(url).then(async (res) => await res.json());
    // 处理数据
    if (response.errmsg === 'success') {
      const result: HotListItem[] = response.data.bang_topic.topic_list.map((v: Record<string, any>) => {
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
  } catch (error) {
    return NextResponse.json(responseError);
  }
}

// 数据过期时间
export const revalidate = parseInt(process.env.CACHE_TIME || '0');
