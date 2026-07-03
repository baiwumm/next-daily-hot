/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:33:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-03 18:00:49
 * @Description: 热榜卡片
 */
'use client';
import { ArrowsRotateRight, CircleCheckFill, CircleXmarkFill } from '@gravity-ui/icons';
import {
  Button,
  Card,
  Chip,
  Description,
  ScrollShadow,
  Separator,
  Spinner,
  Tooltip
} from '@heroui/react';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { motion, useInView } from 'motion/react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

import HotListVirtual from './HotListVirtual'

import 'dayjs/locale/zh-cn';
import BlurFade from '@/components/BlurFade';
import SkeletonCard from '@/components/SkeletonCard'
import { RESPONSE } from '@/enums';
import { useAppStore } from '@/store/useAppStore';

dayjs.extend(utc);
dayjs.extend(timezone);
// 引入处理相对时间的插件
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const HotCard = ({ value, label, tip, prefix, suffix }: App.HotListConfig) => {
  const setUpdateTime = useAppStore(state => state.setUpdateTime);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  // 更新相对时间
  const relativeText = useAppStore(state =>
    state.getRelativeTime(value)
  );

  const { data, loading, run } = useRequest(
    async () => {
      try {
        const response = await fetch(`/api/${value}`)
        if (response.status !== RESPONSE.SUCCESS) {
          throw new Error('Request failed')
        }
        const result: App.IResponse = await response.json()
        if (result.code === RESPONSE.ERROR) {
          throw new Error('API returned error')
        }
        return result.data || []
      } finally {
        // 记录更新时间
        setUpdateTime({ [value]: dayjs().valueOf() })
      }
    },
    {
      manual: true,
      debounceWait: 300,
      retryCount: 3,
    }
  );

  // ✅ 使用 ready 控制自动加载（更可靠）
  useEffect(() => {
    if (isInView) {
      run();
    }
  }, [isInView, run]);
  return (
    <Card className="p-0 gap-0" ref={ref}>
      <Card.Header className="flex justify-between items-center flex-row p-3">
        <div className="flex items-center gap-2">
          <Image
            src={`/${value}.svg`}
            alt={`${label}${tip}`}
            width={24}
            height={24}
            className="rounded-md shrink-0"
          />
          <div className="font-bold text-sm">{label}</div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <Chip color={data?.length ? 'success' : 'danger'} variant="soft" size="sm" className="px-2 py-0.5">
            {loading ? (
              <Spinner size='sm' />
            ) : data?.length ? (
              <CircleCheckFill width={14} />
            ) : (
              <CircleXmarkFill width={14} />
            )}
            {tip}
          </Chip>
        </motion.div>
      </Card.Header>
      <Separator />
      <Card.Content className="relative py-0">
        <ScrollShadow className="h-81.75 " hideScrollBar visibility="bottom">
          {loading ? (
            <SkeletonCard />
          ) : null}
          {loading ? null : !data?.length ? (
            <Description className="flex h-full justify-center items-center px-8 text-center leading-5">
              抱歉，可能服务器遇到问题了，请稍后重试，或者打开右上角设置关闭热榜显示！🤔
            </Description>
          ) : (
            <BlurFade className="h-full pl-3">
              <HotListVirtual data={data} value={value} prefix={prefix} suffix={suffix} />
            </BlurFade>
          )}
        </ScrollShadow>
      </Card.Content>
      <Separator />
      <Card.Footer className="p-3">
        <div className="flex text-center justify-between w-full items-center space-x-4 text-small h-5">
          <Description className="w-1/2">
            {relativeText ? `${relativeText}更新` : '正在加载中...'}
          </Description>
          <Separator orientation="vertical" className="flex-none" />
          <div className="flex w-1/2 justify-center">
            <Tooltip>
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                isDisabled={loading}
                onPress={run}
                className="text-muted rounded-full"
              >
                <ArrowsRotateRight className={loading ? 'animate-spin' : ''} />
              </Button>
              <Tooltip.Content showArrow placement="bottom">
                <Tooltip.Arrow />
                获取最新
              </Tooltip.Content>
            </Tooltip>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default HotCard;