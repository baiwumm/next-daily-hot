/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:33:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-12 17:49:40
 * @Description: 热榜卡片
 */
'use client';
import {
  Button,
  Card,
  Chip,
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
import { CircleX, RefreshCw } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { List } from 'react-window';

import RowComponent from './RowComponent';

import 'dayjs/locale/zh-cn';
import BlurFade from '@/components/BlurFade';
import { RESPONSE, THEME_MODE } from '@/enums';
import { CircleCheckIcon } from '@/lib/icons';
import { useAppStore } from '@/store/useAppStore';

dayjs.extend(utc);
dayjs.extend(timezone);
// 引入处理相对时间的插件
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const HotCard = ({ value, label, tip, prefix, suffix }: App.HotListConfig) => {
  const setUpdateTime = useAppStore(state => state.setUpdateTime);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  const { theme } = useTheme();
  const isLight = theme === THEME_MODE.LIGHT;

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

        // ✅ 成功：记录成功时间
        setUpdateTime({ [value]: dayjs().valueOf() })

        return result.data || []
      } catch (err) {
        // ⚠️ 失败：也记录一次「尝试时间」
        setUpdateTime({ [value]: dayjs().valueOf() })

        throw err
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
    if (isInView && !data?.length) {
      run();
    }
  }, [isInView, run, data]);
  return (
    <Card className="rounded-lg p-0 gap-0 shadow-md border border-default" ref={ref}>
      <Card.Header className="flex justify-between items-center flex-row p-3">
        <div className="flex items-center gap-2">
          <Image
            src={`/${value}.svg`}
            alt={`${label}${tip}`}
            width={24}
            height={24}
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
            {data?.length ? (
              <CircleCheckIcon size={12} />
            ) : (
              <CircleX size={12} />
            )}
            {tip}
          </Chip>
        </motion.div>
      </Card.Header>
      <Separator />
      <Card.Content className="relative pl-3 py-0">
        <ScrollShadow className="h-[327px]" hideScrollBar visibility="both">
          {loading ? (
            <div className="absolute inset-0 w-full h-full flex justify-center items-center card--default/75 z-10">
              <Spinner color="current" />
            </div>
          ) : null}
          {loading ? null : !data?.length ? (
            <div className="flex h-full justify-center items-center text-xs text-slate-500/75 px-8 text-center leading-5">
              抱歉，可能服务器遇到问题了，请稍后重试，或者打开右上角设置关闭热榜显示！🤔
            </div>
          ) : (
            <BlurFade className="h-full">
              <List
                rowComponent={RowComponent}
                rowCount={(data || []).length}
                rowHeight={41}
                rowProps={{ data, isLight, value, prefix, suffix }}
                className="overflow-x-hidden pr-1"
              />
            </BlurFade>
          )}
        </ScrollShadow>
      </Card.Content>
      <Separator />
      <Card.Footer className="p-3">
        <div className="flex text-center justify-between w-full items-center space-x-4 text-small h-5">
          <div className="w-1/2 text-xs text-muted">
            {relativeText ? `${relativeText}更新` : '正在加载中...'}
          </div>
          <Separator orientation="vertical" className="flex-none" />
          <div className="flex w-1/2 justify-center">
            <Tooltip>
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                isDisabled={loading}
                onPress={run}
                className='text-muted'
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} />
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