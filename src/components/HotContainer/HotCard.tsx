/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-10 17:06:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-28 17:04:28
 * @Description: 热榜卡片
 */
'use client';
import 'dayjs/locale/zh-cn';
import { useState, useEffect, useRef } from 'react';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Divider,
  ScrollShadow,
  Tooltip,
  Button,
} from '@nextui-org/react';
import { useRequest, useLocalStorageState, useInterval, useUnmount, useInViewport } from 'ahooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { RiCheckboxCircleFill, RiLoopRightLine, RiCloseCircleLine } from 'react-icons/ri';

// 引入处理相对时间的插件
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

import HotLoading from '@/components/HotLoading';
import OverflowDetector from '@/components/OverflowDetector';

import { REQUEST_STATUS, THEME_MODE, LOCAL_KEY } from '@/utils/enum';
import type { HotListItem, IResponse, UpdateTime, HotListConfig } from '@/utils/types';

import { hotTagColor, hotLableColor, formatNumber } from '@/utils';

const HotCard = ({ value, label, tip, prefix, suffix }: HotListConfig) => {
  // 观察元素是否在可见区域
  const ref = useRef<HTMLInputElement>(null);
  const [inViewport] = useInViewport(ref);
  const { theme } = useTheme();
  // 判断是否是深色主题
  const isLight = theme === THEME_MODE.LIGHT;
  // 实时更新时间
  const [relativeTime, setRelativeTime] = useState<string>('');
  // 请求时间
  const [updateTime, setUpdateTime] = useLocalStorageState<UpdateTime>(LOCAL_KEY.UPDATETIME, {
    defaultValue: {},
  });
  // 判断是否请求失败
  const [isError, setIsError] = useState(false);

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
        const { data, code }: IResponse = await response.json();
        if (updateTime) {
          setUpdateTime({ ...updateTime, [value]: dayjs().valueOf() });
        } else {
          setUpdateTime({ [value]: dayjs().valueOf() });
        }
        setIsError(code === REQUEST_STATUS.ERROR);
        return data || [];
      }
      return [];
    },
    {
      manual: true,
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

  // 只在可视范围内才加载数据
  useEffect(() => {
    if (!data && inViewport && !loading) {
      run();
    }
  }, [data, inViewport, loading, run]);
  return (
    <Card className="rounded-lg" ref={ref} isFooterBlurred>
      {/* 头部 */}
      <CardHeader className="flex justify-between">
        <div className="flex items-center gap-2">
          <Image src={`/${value}.svg`} alt={`${label}${tip}`} width={24} height={24} />
          <div className="font-bold text-sm">{label}</div>
        </div>
        <Chip
          color={isError ? 'danger' : 'success'}
          startContent={isError ? <RiCloseCircleLine size={18} /> : <RiCheckboxCircleFill size={18} />}
          variant="flat"
          size="sm"
        >
          {tip}
        </Chip>
      </CardHeader>
      <Divider />
      {/* 热榜列表 */}
      <CardBody className="p-0">
        <ScrollShadow className="w-full h-[315px]">
          {loading ? (
            <HotLoading />
          ) : data?.length ? (
            <motion.ul
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ease: 'easeInOut', duration: 0.75 }}
            >
              {data.map(({ id, title, label, url, hot, mobileUrl, tip }: HotListItem, index: number) => {
                return (
                  <motion.li
                    key={`${id}-${index}`}
                    className="px-2.5 py-2 border-b last:border-b-0 dark:border-white/25"
                  >
                    {/* 索引 */}
                    <div className="flex justify-between items-center w-full gap-2">
                      <div
                        className="text-xs px-2 rounded flex-initial shrink-0 aspect-square flex items-center"
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
                  </motion.li>
                );
              })}
            </motion.ul>
          ) : (
            <div className="flex h-[300px] justify-center items-center text-xs text-mode px-8 text-center leading-5">
              {isError
                ? '抱歉，可能服务器遇到问题了，请稍后重试，或者打开右上角设置关闭热榜显示！🤓'
                : '各位看官，暂无数据哟🤔'}
            </div>
          )}
        </ScrollShadow>
      </CardBody>
      <Divider />
      {/* 底部 */}
      <CardFooter>
        <div className="flex text-center justify-between w-full items-center space-x-4 text-small h-5">
          <div className="w-1/2 text-xs text-mode">{relativeTime ? `${relativeTime}更新` : '正在加载中...'}</div>
          <Divider orientation="vertical" className="flex-none" />
          <div className="flex w-1/2 justify-center">
            <Tooltip showArrow content="获取最新" placement="bottom">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                isDisabled={loading}
                onClick={run}
                className={`text-mode hover:!bg-gray-50 dark:hover:!bg-gray-800 ${loading ? 'animate-spin' : 'animate-none'}`}
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
