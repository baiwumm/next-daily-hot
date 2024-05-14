/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-10 17:06:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-14 11:18:48
 * @Description: 热榜卡片
 */
'use client';
import 'dayjs/locale/zh-cn';
import { useState } from 'react';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Divider,
  ScrollShadow,
  Tooltip,
  Skeleton,
  Button,
} from '@nextui-org/react';
import { useRequest, useLocalStorageState, useInterval, useUnmount } from 'ahooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { RiCheckboxCircleFill, RiLoopRightLine } from 'react-icons/ri';
// 引入处理相对时间的插件
// 配置使用处理相对时间的插件
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

import { REQUEST_STATUS, THEME_MODE, LOCAL_KEY } from '@/utils/enum';
import type { HotListItem, IResponse, UpdateTime, HotListConfig } from '@/utils/types';

import OverflowDetector from './OverflowDetector';

import { hotTagColor, hotLableColor, formatNumber } from '@/utils';

const HotCard = ({ value, label, tip, prefix, suffix }: HotListConfig) => {
  const { theme } = useTheme();
  // 判断是否是深色主题
  const isLight = theme === THEME_MODE.LIGHT;
  // 实时更新时间
  const [relativeTime, setRelativeTime] = useState<string>('');
  // 请求时间
  const [updateTime, setUpdateTime] = useLocalStorageState<UpdateTime>(LOCAL_KEY.UPDATETIME, {
    defaultValue: {},
  });

  // 渲染热度
  const renderHot = (value: string | number) => (
    <div className="flex-initial shrink-0 text-xs text-black/45 dark:text-white">{value}</div>
  );

  /**
   * @description: 请求榜单接口
   */
  const { data, loading, run } = useRequest(
    async () => {
      const response = await fetch(`/api/${value}`);
      if (response.status === REQUEST_STATUS.SUCCESS) {
        const result: IResponse = await response.json();
        if (updateTime) {
          setUpdateTime({ ...updateTime, [value]: dayjs().valueOf() });
        } else {
          setUpdateTime({ [value]: dayjs().valueOf() });
        }
        return result.data || [];
      }
      return [];
    },
    {
      manual: false,
      // 防抖等待时间, 单位为毫秒，设置后，进入防抖模式
      debounceWait: 300,
      // 错误重试次数。如果设置为 -1，则无限次重试。
      retryCount: 3,
    },
  );

  const clearInterval = useInterval(() => {
    // 更新文案
    const updateText = updateTime ? dayjs(updateTime[value]).fromNow() : dayjs().fromNow();
    setRelativeTime(updateText);
  }, 1000);

  useUnmount(() => {
    clearInterval();
  });
  return (
    <Card className="rounded-lg">
      {/* 头部 */}
      <CardHeader className="flex justify-between">
        <div className="flex items-center gap-2">
          <Image src={`/${value}.svg`} alt={`${label}${tip}`} width={24} height={24} />
          <div className="font-bold text-md">{label}</div>
        </div>
        <Chip color="success" startContent={<RiCheckboxCircleFill size={18} />} variant="flat" size="sm">
          {tip}
        </Chip>
      </CardHeader>
      <Divider />
      {/* 热榜列表 */}
      <CardBody className="p-0">
        <ScrollShadow className="w-full h-[280px]">
          {loading ? (
            <div className="space-y-5 p-5">
              <Skeleton className="w-3/5 h-4 rounded-lg" />
              <Skeleton className="w-3/5 h-4 rounded-lg" />
              <Skeleton className="w-full h-4 rounded-lg" />
              <Skeleton className="w-full h-4 rounded-lg" />
              <Skeleton className="w-full h-4 rounded-lg" />
              <Skeleton className="w-full h-4 rounded-lg" />
              <Skeleton className="w-full h-4 rounded-lg" />
            </div>
          ) : data?.length ? (
            <ul className="m-0 p-0">
              {data.map(({ id, title, label, url, hot, mobileUrl, tip }: HotListItem, index: number) => {
                return (
                  <li key={`${id}-${index}`} className="px-3 py-2 border-b last:border-b-0">
                    {/* 索引 */}
                    <div className="flex justify-between items-center w-full gap-2">
                      <div
                        className="text-xs py-1 px-2 rounded flex-initial shrink-0"
                        style={{
                          backgroundColor: label
                            ? hotLableColor[label]
                            : hotTagColor[index] || (!isLight ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0,0,0,.04)'),
                          color: isLight && (label ? hotLableColor[label] : hotTagColor[index]) ? '#ffffff' : 'inherit',
                        }}
                      >
                        {label || index + 1}
                      </div>
                      {/* 标题 */}
                      <OverflowDetector url={url} mobileUrl={mobileUrl}>
                        {title}
                      </OverflowDetector>
                      {/* 热度 */}
                      {hot
                        ? renderHot(formatNumber(hot))
                        : tip
                          ? renderHot(`${prefix || ''}${tip}${suffix || ''}`)
                          : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex h-[300px] justify-center items-center text-sm text-slate-600 dark:text-slate-400">
              各位看官，暂无数据哟🤔
            </div>
          )}
        </ScrollShadow>
      </CardBody>
      <Divider />
      {/* 底部 */}
      <CardFooter>
        <div className="flex text-center justify-between w-full items-center space-x-4 text-small h-5">
          <div className="w-1/2 text-xs text-black/45 dark:text-white">
            {relativeTime ? `${relativeTime}更新` : '正在加载中...'}
          </div>
          <Divider orientation="vertical" className="flex-none" />
          <div className="flex w-1/2 justify-center">
            <Tooltip showArrow content="获取最新" placement="bottom">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                isDisabled={loading}
                onClick={run}
                className="text-black/45 dark:text-white"
              >
                <RiLoopRightLine size={18} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
export default HotCard;
