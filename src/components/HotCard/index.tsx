/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:33:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 16:26:20
 * @Description: 热榜卡片
 */
'use client';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  ScrollShadow,
  Skeleton,
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify-icon/react';
import {
  useInterval,
  useInViewport,
  useLocalStorageState,
  useRequest,
} from 'ahooks';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import OverflowDetector from '@/components/OverflowDetector';
import { LOCAL_KEY, REQUEST_STATUS, THEME_MODE } from '@/lib/constant';
import type { HotListConfig, IResponse, UpdateTime } from '@/lib/type';
import { formatNumber, hotLableColor, hotTagColor } from '@/lib/utils';

const HotCard = ({ value, label, tip, prefix, suffix }: HotListConfig) => {
  const ref = useRef<HTMLDivElement>(null); // 👈 修正类型：Card 是 div
  const [inViewport] = useInViewport(ref);
  const { theme } = useTheme();
  const isLight = theme === THEME_MODE.LIGHT;

  const [relativeTime, setRelativeTime] = useState<string>('');
  const [updateTime, setUpdatetime] = useLocalStorageState<UpdateTime>(
    LOCAL_KEY.UPDATETIME,
    {
      defaultValue: {},
    }
  );

  // ✅ 函数式更新，避免覆盖其他字段
  const updateTimestamp = () =>
    setUpdatetime((prev) => ({
      ...prev,
      [value]: dayjs().valueOf(),
    }));

  const renderHot = (value: string | number) => (
    <div className="flex-initial shrink-0 text-xs text-black/45 dark:text-white">
      {value}
    </div>
  );

  const { data, loading, run, error } = useRequest(
    async () => {
      const response = await fetch(`/api/${value}`);
      if (response.status !== REQUEST_STATUS.SUCCESS) {
        throw new Error('Request failed');
      }
      const result: IResponse = await response.json();
      if (result.code === REQUEST_STATUS.ERROR) {
        throw new Error('API returned error');
      }
      updateTimestamp(); // ✅ 成功后更新时间
      return result.data || [];
    },
    {
      manual: true,
      debounceWait: 300,
      retryCount: 3,
    }
  );

  const isError = !!error;

  // ✅ 使用 ready 控制自动加载（更可靠）
  useEffect(() => {
    if (inViewport && !loading && !data && !error) {
      run();
    }
  }, [inViewport, run, loading, data, error]);

  // ✅ 自动清理的 interval（ahooks 内部已处理）
  useInterval(() => {
    const lastUpdate = updateTime?.[value];
    const text = lastUpdate ? dayjs(lastUpdate).fromNow() : '刚刚';
    setRelativeTime(text);
  }, 1000);

  return (
    <Card className="rounded-lg" ref={ref} isFooterBlurred>
      <CardHeader className="flex justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={`/${value}.svg`}
            alt={`${label}${tip}`}
            width={24}
            height={24}
          />
          <div className="font-bold text-sm">{label}</div>
        </div>
        <Chip
          color={isError ? 'danger' : 'success'}
          startContent={
            isError ? (
              <Icon icon="ri:close-circle-fill" className="text-lg" />
            ) : (
              <Icon icon="ri:checkbox-circle-fill" className="text-lg" />
            )
          }
          variant="flat"
          size="sm"
        >
          {tip}
        </Chip>
      </CardHeader>
      <Divider />
      <CardBody className="p-0">
        <ScrollShadow className="w-full h-[315px]">
          {loading ? (
            <div className="space-y-5 p-5">
              {['w-4/5', 'w-full', 'w-3/4', 'w-5/6', 'w-2/3', 'w-full', 'w-11/12', 'w-5/6'].map((w, i) => (
                <Skeleton key={i} className={`${w} h-4 rounded-lg`} />
              ))}
            </div>
          ) : !isError && data?.length ? (
            <AnimatePresence>
              <motion.ul
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ ease: 'easeInOut', duration: 0.5 }}
                className="list-none"
              >
                {data?.map((record, index) => {
                  const { id, title, label: itemLabel, hot, tip: itemTip } = record;
                  // ✅ 更稳定的 key
                  const key = id ?? `${value}-${index}`;

                  return (
                    <motion.li
                      key={key}
                      className="px-2.5 py-2 border-b last:border-b-0 border-slate-200 dark:border-white/25"
                    >
                      <div className="flex justify-between items-center w-full gap-2">
                        <div
                          className="text-xs px-2 rounded flex-initial shrink-0 aspect-square flex items-center justify-center"
                          style={{
                            backgroundColor: itemLabel
                              ? hotLableColor[itemLabel]
                              : hotTagColor[index] || (!isLight ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0,0,0,.04)'),
                            color: isLight && (itemLabel ? hotLableColor[itemLabel] : hotTagColor[index]) ? '#ffffff' : 'inherit',
                          }}
                        >
                          {itemLabel || index + 1}
                        </div>
                        <OverflowDetector record={record} type={value}>
                          {title}
                        </OverflowDetector>
                        {hot
                          ? renderHot(formatNumber(hot))
                          : itemTip
                            ? renderHot(`${prefix || ''}${itemTip}${suffix || ''}`)
                            : null}
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </AnimatePresence>
          ) : (
            <div className="flex h-[300px] justify-center items-center text-xs text-slate-500/75 px-8 text-center leading-5">
              抱歉，可能服务器遇到问题了，请稍后重试，或者打开右上角设置关闭热榜显示！🤔
            </div>
          )}
        </ScrollShadow>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex text-center justify-between w-full items-center space-x-4 text-small h-5">
          <div className="w-1/2 text-xs text-slate-500/75">
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
                onPress={run}
                className={`text-slate-500/75 hover:bg-gray-50! dark:hover:bg-gray-800! ${loading ? 'animate-spin' : ''
                  }`}
              >
                <Icon icon="ri:loop-right-line" className="text-lg" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default HotCard;